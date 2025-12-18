import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * POST /internal/worker/process-scheduled
 * Publish quizzes whose scheduled_at/published_at <= now
 */
export const processScheduledQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query(
      `UPDATE quizzes
       SET status = 'published', published_at = now(), updated_at = now()
       WHERE status = 'scheduled' AND published_at IS NOT NULL AND published_at <= now()
       RETURNING id, slug, published_at`
    );

    res.json({ processed: result.rows.length, quizzes: result.rows });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /internal/worker/generate-share-cards
 * Batch generate share cards (stub)
 */
export const batchGenerateShareCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Placeholder: In production this would enqueue jobs for image generation
    res.json({ message: 'Batch generation started (stub)' });
  } catch (error) {
    next(error);
  }
};
