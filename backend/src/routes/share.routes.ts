import { Router } from 'express';
import { generateShareCard } from '../controllers/share.controller';

const router = Router();

/**
 * GET /api/share/:slug/card
 */
router.get('/:slug/card', generateShareCard);

export default router;
