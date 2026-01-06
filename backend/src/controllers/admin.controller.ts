import { Request, Response, NextFunction } from 'express';
import { query, getPool } from '../config/database';

/**
 * GET /api/admin/quiz
 * List all quizzes including drafts, scheduled, archived
 */
export const getAdminQuizList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if database is available
    try {
      getPool();
    } catch (dbError) {
      // Database not connected - return empty list with warning
      console.warn('Database not connected, returning empty quiz list');
      res.json({
        quizzes: [],
        total: 0,
        limit: 50,
        offset: 0,
        warning: 'Database not connected. Please start PostgreSQL.',
      });
      return;
    }

    const { status, limit = '50', offset = '0' } = req.query;

    let queryText = `
      SELECT id, slug, title, status, quiz_data,
             created_at, updated_at, published_at, version
      FROM quizzes
    `;

    const params: any[] = [];

    if (status) {
      queryText += ` WHERE status = $1`;
      params.push(status);
    }

    queryText += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), parseInt(offset as string, 10));

    console.log('Executing query:', queryText, params);
    const result = await query(queryText, params);

    res.json({
      quizzes: result.rows,
      total: result.rows.length,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
    });
  } catch (error: any) {
    console.error('getAdminQuizList error:', error?.message || error);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quizzes', 
      details: error?.message || 'Unknown error' 
    });
  }
};

/**
 * POST /api/admin/quiz
 * Create new quiz
 */
export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quizData = req.body;

    // Generate slug if not provided
    const slug = quizData.slug || generateSlug(quizData.title);

    // Check if slug already exists
    const existing = await query('SELECT id FROM quizzes WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      res.status(400).json({ error: 'Quiz with this slug already exists' });
      return;
    }

    // Insert quiz with draft status
    const result = await query(
      `INSERT INTO quizzes (slug, title, status, quiz_data, version, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, slug, title, status, version, created_at`,
      [slug, quizData.title, 'draft', JSON.stringify(quizData), 1, new Date(), new Date()]
    );

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/quiz/:slug
 * Update existing quiz
 */
export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const quizData = req.body;

    // Get current version and data
    const current = await query('SELECT version, quiz_data, created_by FROM quizzes WHERE slug = $1', [slug]);
    if (current.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const currentVersion = current.rows[0].version || 1;
    const currentData = current.rows[0].quiz_data;
    const newVersion = currentVersion + 1;

    // Save current into quiz_versions
    try {
      await query(
        `INSERT INTO quiz_versions (quiz_slug, version, quiz_data, created_at, created_by, change_summary)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [slug, currentVersion, JSON.stringify(currentData), new Date(), current.rows[0].created_by || null, 'update']
      );
    } catch (err) {
      // ignore version save errors
    }

    // Update quiz and increment version
    const result = await query(
      `UPDATE quizzes
       SET quiz_data = $1, version = $2, updated_at = $3, title = $4
       WHERE slug = $5
       RETURNING id, slug, title, status, version, updated_at`,
      [JSON.stringify(quizData), newVersion, new Date(), quizData.title, slug]
    );

    res.json({
      message: 'Quiz updated successfully',
      quiz: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/quiz/:slug
 * Delete quiz (soft delete - archive)
 */
export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    // Soft delete by setting status to archived
    const result = await query(
      `UPDATE quizzes SET status = 'archived', updated_at = $1
       WHERE slug = $2
       RETURNING id, slug, status`,
      [new Date(), slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json({
      message: 'Quiz archived successfully',
      quiz: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/quiz/:slug/publish
 * Publish or unpublish quiz
 */
export const publishQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { publish } = req.body; // true or false

    const newStatus = publish ? 'published' : 'draft';

    const result = await query(
      `UPDATE quizzes
       SET status = $1, updated_at = $2, published_at = $3
       WHERE slug = $4
       RETURNING id, slug, status, published_at`,
      [newStatus, new Date(), publish ? new Date() : null, slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json({
      message: `Quiz ${publish ? 'published' : 'unpublished'} successfully`,
      quiz: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/quiz/:slug/schedule
 * Schedule quiz for future publication
 */
export const scheduleQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { publish_at } = req.body;

    if (!publish_at) {
      res.status(400).json({ error: 'publish_at date is required' });
      return;
    }

    const result = await query(
      `UPDATE quizzes
       SET status = 'scheduled', published_at = $1, updated_at = $2
       WHERE slug = $3
       RETURNING id, slug, status, published_at`,
      [new Date(publish_at), new Date(), slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json({
      message: 'Quiz scheduled successfully',
      quiz: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};



/**
 * GET /api/admin/images
 * List uploaded images
 */
export const getImageList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = '50' } = req.query;

    // This would list files from uploads directory
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadsDir)) {
      res.json({ images: [] });
      return;
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter((file: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .slice(0, parseInt(limit as string))
      .map((file: string) => ({
        filename: file,
        url: `/uploads/${file}`,
        uploaded_at: fs.statSync(path.join(uploadsDir, file)).mtime,
      }));

    res.json({ images });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/:slug
 * Get quiz analytics
 */
export const getQuizAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    // Get event counts by type
    const eventCounts = await query(
      `SELECT event_type, COUNT(*) as count
       FROM quiz_analytics
       WHERE quiz_slug = $1
       GROUP BY event_type`,
      [slug]
    );

    // Get completion rate
    const views = await query(
      `SELECT COUNT(*) FROM quiz_analytics WHERE quiz_slug = $1 AND event_type = 'quiz_view'`,
      [slug]
    );

    const completions = await query(
      `SELECT COUNT(*) FROM quiz_analytics WHERE quiz_slug = $1 AND event_type = 'quiz_completed'`,
      [slug]
    );

    const viewCount = parseInt(views.rows[0].count);
    const completionCount = parseInt(completions.rows[0].count);
    const completionRate = viewCount > 0 ? (completionCount / viewCount) * 100 : 0;

    // Get outcome distribution
    const outcomes = await query(
      `SELECT event_data->>'outcome' as outcome, COUNT(*) as count
       FROM quiz_analytics
       WHERE quiz_slug = $1 AND event_type = 'quiz_completed'
       GROUP BY event_data->>'outcome'`,
      [slug]
    );

    res.json({
      slug,
      total_views: viewCount,
      total_completions: completionCount,
      completion_rate: completionRate.toFixed(2) + '%',
      events: eventCounts.rows,
      outcome_distribution: outcomes.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/quiz/bulk-delete
 * Body: { slugs: string[] }
 */
export const bulkDeleteQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slugs } = req.body;
    if (!Array.isArray(slugs) || slugs.length === 0) {
      res.status(400).json({ error: 'slugs array is required' });
      return;
    }

    const result = await query(
      `UPDATE quizzes SET status = 'archived', updated_at = $1 WHERE slug = ANY($2::text[]) RETURNING slug`,
      [new Date(), slugs]
    );

    res.json({ message: 'Quizzes archived', archived: result.rows.map(r => r.slug) });
  } catch (error) {
    console.error('Error bulk archiving quizzes:', error);
    res.status(500).json({ error: 'Failed to archive quizzes' });
  }
};

/**
 * Helper: Generate URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * GET /api/admin/versions/:slug
 * Return version history from quiz_versions
 */
export const getQuizVersions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT version, quiz_data, created_at, created_by, change_summary
       FROM quiz_versions
       WHERE quiz_slug = $1
       ORDER BY version DESC`,
      [slug]
    );

    res.json({ versions: result.rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/quiz/:slug/preview
 * Return quiz draft/published data for preview (bypass publish filter)
 */
export const getQuizPreview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { device = 'desktop' } = req.query;

    const result = await query('SELECT quiz_data FROM quizzes WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const quizData = result.rows[0].quiz_data;

    // Attach a small preview hint for device
    res.json({ preview_device: device, quiz: quizData });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/quiz/:slug/rollback
 * Rollback to a specific version (by version number)
 */
export const rollbackQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { version } = req.body;

    if (!version) {
      res.status(400).json({ error: 'version is required' });
      return;
    }

    const versionRow = await query(
      `SELECT quiz_data, version FROM quiz_versions WHERE quiz_slug = $1 AND version = $2`,
      [slug, version]
    );

    if (versionRow.rows.length === 0) {
      res.status(404).json({ error: 'Version not found' });
      return;
    }

    const versionData = versionRow.rows[0].quiz_data;
    const versionNumber = versionRow.rows[0].version;

    // Update quizzes table
    const updated = await query(
      `UPDATE quizzes SET quiz_data = $1, version = $2, updated_at = $3 WHERE slug = $4 RETURNING id, slug, version`,
      [JSON.stringify(versionData), versionNumber, new Date(), slug]
    );

    res.json({ message: 'Rolled back', quiz: updated.rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/quiz/:slug/sponsor
 * Configure sponsorship details
 */
export const configureSponsorship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { sponsor_name, sponsor_logo, cta_text, cta_url, utm_campaign, active = true } = req.body;

    const sponsorship = {
      sponsor_name: sponsor_name || null,
      sponsor_logo: sponsor_logo || null,
      cta_text: cta_text || null,
      cta_url: cta_url || null,
      utm_campaign: utm_campaign || null,
      active: !!active,
      updated_at: new Date(),
    };

    // Store sponsorship object inside quiz_data.sponsorship
    const result = await query(
      `UPDATE quizzes SET quiz_data = jsonb_set(COALESCE(quiz_data,'{}'::jsonb), '{sponsorship}', $1::jsonb, true), updated_at = $2 WHERE slug = $3 RETURNING id, slug, quiz_data`,
      [JSON.stringify(sponsorship), new Date(), slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json({ message: 'Sponsorship saved', quiz: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/quiz/:slug/ads
 * Configure ad slots for a quiz (basic implementation)
 */
export const configureAds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { slots } = req.body; // expected: [{slot_name, provider, config}, ...]

    if (!Array.isArray(slots)) {
      res.status(400).json({ error: 'slots must be an array' });
      return;
    }

    // Minimal implementation: update quiz_data with ads configuration
    const result = await query(
      `UPDATE quizzes
       SET quiz_data = jsonb_set(quiz_data, '{ads}', $1::jsonb, true), updated_at = $2
       WHERE slug = $3
       RETURNING id, slug, quiz_data`,
      [JSON.stringify(slots), new Date(), slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found', slug });
      return;
    }

    res.json({ message: 'Ad slots configured', quiz: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
