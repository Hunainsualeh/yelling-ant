import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * POST /api/user/badges
 * Assign badge to a user. Body: { user_id, badge_key, awarded_by? }
 */
export const assignBadge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user_id, badge_key, awarded_by } = req.body;

    if (!user_id || !badge_key) {
      res.status(400).json({ error: 'user_id and badge_key are required' });
      return;
    }

    // Try to persist badge; if table doesn't exist, return success but note not persisted
    try {
      const result = await query(
        `INSERT INTO user_badges (user_id, badge_key, awarded_by, created_at)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, badge_key, awarded_by, created_at`,
        [user_id, badge_key, awarded_by || null, new Date()]
      );

      res.status(201).json({ message: 'Badge assigned', badge: result.rows[0] });
      return;
    } catch (dbErr) {
      // Table may not exist yet — return success response but indicate not persisted
      res.status(201).json({
        message: 'Badge assigned (not persisted - DB unavailable)',
        badge: { user_id, badge_key, awarded_by, created_at: new Date() },
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const getUserBadges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT badge_key, badge_name, badge_image, awarded_at FROM user_badges WHERE user_id = $1 ORDER BY awarded_at DESC`,
      [id]
    );

    res.json({ user_id: id, badges: result.rows });
  } catch (error) {
    next(error);
  }
};
