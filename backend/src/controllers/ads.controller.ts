import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

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
    let queryText = 'SELECT * FROM ads';
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

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
};

/**
 * POST /api/ads
 * Create a new ad
 */
export const createAd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, brand, status, slot, content } = req.body;
    
    const result = await query(
      `INSERT INTO ads (name, brand, status, slot, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, brand, status || 'active', slot, content]
    );

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

    res.json(result.rows[0]);
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
