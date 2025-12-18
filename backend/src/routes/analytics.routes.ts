import { Router } from 'express';
import { trackEvent } from '../controllers/analytics.controller';
import { rateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * POST /api/analytics/track
 * Track analytics events
 * Rate limited to prevent spam
 * 
 * Body: {
 *   "quiz_slug": "which-auntie-are-you",
 *   "event_type": "quiz_view" | "quiz_start" | "quiz_completed" | etc.,
 *   "event_data": { ... },
 *   "user_id": "optional",
 *   "session_id": "optional"
 * }
 */
router.post('/track', rateLimiter, trackEvent);

export default router;
