import { Router } from 'express';
import { processScheduledQuizzes, batchGenerateShareCards } from '../controllers/internal.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// These endpoints should be protected/internal-only
router.post('/worker/process-scheduled', authMiddleware, processScheduledQuizzes);
router.post('/worker/generate-share-cards', authMiddleware, batchGenerateShareCards);

export default router;
