import { Router, Request, Response } from 'express';
import { getQuizList, getQuizBySlug, submitQuiz } from '../controllers/quiz.controller';
import { validateQuizSubmission } from '../middleware/validation.middleware';
import { rateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * GET /api/quiz
 * List all published quizzes
 * Query params: ?colony=X&tag=Y&limit=10&offset=0
 */
router.get('/', getQuizList);

/**
 * GET /api/quiz/:slug
 * Fetch a single quiz by slug
 * Returns full quiz JSON
 */
router.get('/:slug', getQuizBySlug);

/**
 * POST /api/quiz/:slug/submit
 * Submit quiz answers and get result
 * Rate limited to prevent abuse
 */
router.post(
  '/:slug/submit',
  rateLimiter,
  validateQuizSubmission,
  submitQuiz
);

export default router;
