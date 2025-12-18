import { Router } from 'express';
import { clearCache, getCacheStats } from '../controllers/cache.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/clear', authMiddleware, clearCache);
router.get('/stats', authMiddleware, getCacheStats);

export default router;
