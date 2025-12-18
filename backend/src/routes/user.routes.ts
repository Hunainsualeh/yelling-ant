import { Router } from 'express';
import { assignBadge } from '../controllers/user.controller';
import { getUserBadges } from '../controllers/user.controller';

const router = Router();

/**
 * POST /api/user/badges
 */
router.post('/badges', assignBadge);
router.get('/:id/badges', getUserBadges);

export default router;
