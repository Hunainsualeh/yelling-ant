import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * POST /api/analytics/track
 * Track analytics events
 */
export const trackEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quiz_slug, event_type, event_data, user_id, session_id } = req.body;

    // Validate required fields
    if (!quiz_slug || !event_type) {
      res.status(400).json({ error: 'quiz_slug and event_type are required' });
      return;
    }

    // Valid event types
    const validEvents = [
      'quiz_view',
      'quiz_start',
      'quiz_question_answered',
      'quiz_completed',
      'quiz_retaken',
      'quiz_share_click',
      'quiz_result_impression',
      'quiz_result_badge_awarded',
      'quiz_related_quiz_click',
    ];

    if (!validEvents.includes(event_type)) {
      res.status(400).json({
        error: 'Invalid event_type',
        valid_types: validEvents,
      });
      return;
    }

    // Insert event
    await query(
      `INSERT INTO quiz_analytics (quiz_slug, event_type, event_data, user_id, session_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [quiz_slug, event_type, event_data || {}, user_id || null, session_id || null, new Date()]
    );

    res.status(201).json({
      message: 'Event tracked successfully',
      event_type,
    });
  } catch (error) {
    next(error);
  }
};
