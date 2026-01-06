import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

// In-memory cache for ads to reduce database load
interface CachedAds {
  data: any[];
  timestamp: number;
}

const adsCache: Map<string, CachedAds> = new Map();
const CACHE_TTL = 30000; // 30 seconds cache

const getCacheKey = (slot?: string, status?: string) => {
  return `${slot || 'all'}_${status || 'all'}`;
};

const clearAdsCache = () => {
  adsCache.clear();
  console.log('[AdsController] Cache cleared');
};

// Sanity limits for ad content
const MAX_CONTENT_URL_LENGTH = 100 * 1024; // 100 KB
const MAX_CONTENT_JSON_SIZE = 200 * 1024; // 200 KB

const isDataUrl = (u?: string) => typeof u === 'string' && u.startsWith('data:');

// Remove/replace oversized or inline data-uris before sending to clients
const sanitizeAds = (rows: any[]) => {
  return rows.map((r) => {
    try {
      if (r && r.content && typeof r.content === 'object') {
        const url = r.content.url;
        if (typeof url === 'string') {
          if (isDataUrl(url) || url.length > MAX_CONTENT_URL_LENGTH) {
            console.warn('[AdsController] Trimming oversized or inline ad content.url for ad id', r.id, 'len=', (url && url.length) || 0);
            // Remove the bulky URL to avoid huge API responses; client will show placeholder
            return { ...r, content: { ...r.content, url: '' } };
          }
        }
        // also guard the full content JSON size
        const contentJson = JSON.stringify(r.content || {});
        if (contentJson.length > MAX_CONTENT_JSON_SIZE) {
          console.warn('[AdsController] Trimming oversized ad content JSON for ad id', r.id, 'size=', contentJson.length);
          return { ...r, content: { type: r.content.type || 'html' } };
        }
      }
    } catch (e) {
      console.warn('[AdsController] Error sanitizing ad', r && r.id, e);
    }
    return r;
  });
};

/**
 * GET /api/ads/:id
 * Get a single ad by ID
 */
export const getAdById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, brand, status, slot, content, impressions, ctr, created_at, updated_at FROM ads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ad not found' });
      return;
    }

    // Sanitize before returning
    const sanitized = sanitizeAds(result.rows)[0];
    res.json(sanitized);
  } catch (error: any) {
    console.error('Error fetching ad by ID:', error);
    res.status(500).json({ error: 'Failed to fetch ad', message: error.message });
  }
};

/**
 * GET /api/ads
 * List all ads (for admin) or filter by slot (for public)
 */
export const getAds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slot, status } = req.query;
    const cacheKey = getCacheKey(slot as string, status as string);

    // Check cache first
    const cached = adsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('[AdsController] Serving from cache:', cacheKey);
      // cached.data should already be sanitized, but guard anyway
      res.json(cached.data);
      return;
    }

    let queryText = 'SELECT id, name, brand, status, slot, content, impressions, ctr, created_at, updated_at FROM ads';
    const params: any[] = [];
    const conditions: string[] = [];

    if (slot) {
      conditions.push(`slot = $${params.length + 1}`);
      params.push(slot);
    }

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY created_at DESC LIMIT 50';

    const qStart = Date.now();
    const result = await query(queryText, params);
    const qDur = Date.now() - qStart;
    if (qDur > 2000) {
      console.warn('[AdsController] Slow ads query', { queryText, params, durationMs: qDur });
    } else {
      console.log('[AdsController] Ads query duration ms', qDur);
    }

    // Sanitize large/inline content before caching/returning
    const sanitized = sanitizeAds(result.rows);

    // Cache the sanitized result
    adsCache.set(cacheKey, {
      data: sanitized,
      timestamp: Date.now()
    });

    res.json(sanitized);
  } catch (error: any) {
    console.error('Error fetching ads:', error);
    // Check if this is a table not found error
    if (error.code === '42P01') {
      // Table doesn't exist - return empty array
      res.json([]);
      return;
    }
    // On timeout, return cached data if available or empty array
    if (error.code === '57014') {
      const cacheKey = getCacheKey(req.query.slot as string, req.query.status as string);
      const cached = adsCache.get(cacheKey);
      if (cached) {
        console.log('[AdsController] Timeout - serving stale cache');
        res.json(cached.data);
        return;
      }
      res.json([]);
      return;
    }
    res.status(500).json({ error: 'Failed to fetch ads', message: error.message });
  }
};

// Slots where only ONE ad should be active at a time
const SINGLE_AD_SLOTS = ['quiz-main', 'quiz-result', 'YA_QHOME_TOP_001', 'YA_QHOME_FEED_001', 'YA_QHOME_FEED_002', 'YA_QHOME_FEED_003'];

/**
 * POST /api/ads
 * Create a new ad - auto-deactivates previous ads in single-ad slots
 */
export const createAd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, brand, status, slot, content } = req.body;

    // Validate content: reject inline data URLs or very large content to avoid storing huge blobs
    if (content && typeof content === 'object') {
      const url = content.url;
      const contentSize = JSON.stringify(content).length;
      if (isDataUrl(url) || (typeof url === 'string' && url.length > MAX_CONTENT_URL_LENGTH) || contentSize > MAX_CONTENT_JSON_SIZE) {
        res.status(400).json({ error: 'Ad content is too large or contains inline data. Upload the image via /api/admin/upload and set content.url to the uploaded image URL.' });
        return;
      }
    }

    // For single-ad slots, deactivate existing ads in that slot
    if (SINGLE_AD_SLOTS.includes(slot) && status === 'active') {
      await query(
        `UPDATE ads SET status = 'inactive', updated_at = CURRENT_TIMESTAMP 
         WHERE slot = $1 AND status = 'active'`,
        [slot]
      );
      console.log(`[AdsController] Deactivated previous ads in slot: ${slot}`);
    }

    const result = await query(
      `INSERT INTO ads (name, brand, status, slot, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, brand, status || 'active', slot, content]
    );

    // Clear cache after creating ad
    clearAdsCache();

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ error: 'Failed to create ad' });
  }
};

/**
 * PUT /api/ads/:id
 * Update an ad
 */
export const updateAd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, brand, status, slot, content } = req.body;

    // Validate content for updates as well
    if (content && typeof content === 'object') {
      const url = content.url;
      const contentSize = JSON.stringify(content).length;
      if (isDataUrl(url) || (typeof url === 'string' && url.length > MAX_CONTENT_URL_LENGTH) || contentSize > MAX_CONTENT_JSON_SIZE) {
        res.status(400).json({ error: 'Ad content is too large or contains inline data. Use /api/admin/upload and set content.url to the uploaded image URL.' });
        return;
      }
    }

    const result = await query(
      `UPDATE ads 
       SET name = COALESCE($1, name),
           brand = COALESCE($2, brand),
           status = COALESCE($3, status),
           slot = COALESCE($4, slot),
           content = COALESCE($5, content),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, brand, status, slot, content, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ad not found' });
      return;
    }

    // Clear cache after updating ad
    clearAdsCache();

    // Return sanitized row
    const sanitized = sanitizeAds(result.rows)[0];

    res.json(sanitized);
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({ error: 'Failed to update ad' });
  }
};

/**
 * DELETE /api/ads/:id
 * Delete an ad
 */
export const deleteAd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM ads WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ad not found' });
      return;
    }

    // Clear cache after deleting ad
    clearAdsCache();

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
};

/**
 * POST /api/ads/:id/impression
 * Track impression
 */
export const trackImpression = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await query('UPDATE ads SET impressions = impressions + 1 WHERE id = $1', [id]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking impression:', error);
    res.status(500).json({ error: 'Failed to track impression' });
  }
};

/**
 * POST /api/ads/bulk-delete
 * Body: { ids: number[] }
 */
export const bulkDeleteAds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'ids array is required' });
      return;
    }

    const result = await query('DELETE FROM ads WHERE id = ANY($1::int[]) RETURNING id', [ids]);

    // Clear cache
    clearAdsCache();

    res.json({ message: 'Deleted ads', deleted: result.rows.map(r => r.id) });
  } catch (error) {
    console.error('Error bulk deleting ads:', error);
    res.status(500).json({ error: 'Failed to delete ads' });
  }
};
