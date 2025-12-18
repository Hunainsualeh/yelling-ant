import { Router } from 'express';
import {
  getColonyQuizzesIntegration,
  associateQuizWithColony,
  generateShareCardIntegration,
  trackShareEventIntegration,
} from '../controllers/integration.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = Router();

router.get('/colony/:id/quizzes', cacheMiddleware(300), getColonyQuizzesIntegration);
router.post('/colony/:id/quizzes/:slug', authMiddleware, associateQuizWithColony);
router.get('/share/:slug/card', generateShareCardIntegration);
router.post('/share/:slug/track', trackShareEventIntegration);

export default router;
