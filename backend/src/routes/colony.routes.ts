import { Router } from 'express';
import { getColonyQuizzes } from '../controllers/colony.controller';

const router = Router();

/**
 * GET /api/colony/:id/quizzes
 */
router.get('/:id/quizzes', getColonyQuizzes);

export default router;
