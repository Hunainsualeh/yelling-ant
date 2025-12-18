import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * GET /api/seo/:slug
 * Return SEO metadata for a quiz (title, description, og:image, twitter card, etc.)
 */
export const getSeoMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const result = await query(`SELECT quiz_data FROM quizzes WHERE slug = $1 AND status = $2`, [slug, 'published']);

    if (!result || result.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const quiz = result.rows[0].quiz_data;

    const seo = {
      title: quiz.title || quiz.slug,
      description: quiz.dek || quiz.description || '',
      'og:title': quiz.title || quiz.slug,
      'og:description': quiz.dek || '',
      'og:image': quiz.hero_image || quiz.share_image || null,
      'twitter:card': 'summary_large_image',
    };

    res.json({ slug, seo });
  } catch (error) {
    next(error);
  }
};
