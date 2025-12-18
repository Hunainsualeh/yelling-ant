import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * GET /api/colony/:id/quizzes
 * Return published quizzes filtered by colony id (primary or secondary)
 */
export const getColonyQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { limit = '20', offset = '0' } = req.query;

    const result = await query(
      `SELECT id, slug, title, quiz_data->>'dek' as dek, quiz_data->>'hero_image' as hero_image, quiz_data->'tags' as tags, created_at, updated_at
       FROM quizzes
       WHERE status = 'published'
         AND (
           quiz_data->>'primary_colony' = $1
           OR quiz_data->'secondary_colonies' ? $1
         )
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    res.json({ quizzes: result.rows, total: result.rows.length });
  } catch (error) {
    next(error);
  }
};
