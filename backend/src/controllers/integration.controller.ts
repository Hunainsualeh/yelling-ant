import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { trackEvent as trackShareEvent } from './analytics.controller';

/**
 * GET /api/integration/colony/:id/quizzes
 */
export const getColonyQuizzesIntegration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { limit = '20', offset = '0', status = 'published' } = req.query;

    const result = await query(
      `SELECT id, slug, title, quiz_data->>'dek' as dek, quiz_data->>'hero_image' as hero_image
       FROM quizzes
       WHERE ($1::text IS NULL OR quiz_data->>'primary_colony' = $1 OR quiz_data->'secondary_colonies' ? $1)
         AND ($2::text IS NULL OR status = $2)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [id, status, limit, offset]
    );

    res.json({ quizzes: result.rows });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/integration/colony/:id/quizzes/:slug
 * Associate quiz with colony
 */
export const associateQuizWithColony = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, slug } = req.params;
    const { association_type = 'primary' } = req.body;

    await query(
      `INSERT INTO colony_quizzes (colony_id, quiz_slug, association_type, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [id, slug, association_type, new Date()]
    );

    res.status(201).json({ message: 'Associated', colony_id: id, slug });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/integration/share/:slug/card
 * Proxy to existing share card generator (returns same payload)
 */
export const generateShareCardIntegration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Reuse share.controller logic by importing there if needed — for now, simple URL
    const base = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    res.json({ card_url: `${base}/shares/${req.params.slug}.png` });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/integration/share/:slug/track
 */
export const trackShareEventIntegration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { platform, user_id, result_id } = req.body;

    await query(
      `INSERT INTO share_events (quiz_slug, result_id, platform, user_id, shared_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [slug, result_id || null, platform, user_id || null, new Date()]
    );

    // Optionally track via analytics
    await query(
      `INSERT INTO quiz_analytics (quiz_slug, event_type, event_data, created_at)
       VALUES ($1, $2, $3, $4)`,
      [slug, 'quiz_share_click', JSON.stringify({ platform, result_id }), new Date()]
    );

    res.status(201).json({ message: 'Share tracked' });
  } catch (error) {
    next(error);
  }
};
