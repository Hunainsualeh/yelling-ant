import { Router, Request, Response } from 'express';
import { getQuizList, getQuizBySlug, submitQuiz, getRelatedQuizzes, searchQuizzes } from '../controllers/quiz.controller';
import { getNextQuestionForAnswer } from '../controllers/branching.controller';
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
 * GET /api/quiz/search
 * Search quizzes with normalized matching
 * Query params: ?q=search+term&limit=20&offset=0
 */
router.get('/search', searchQuizzes);

/**
 * GET /api/quiz/:slug
 * Fetch a single quiz by slug
 * Returns full quiz JSON
 */
router.get('/:slug', getQuizBySlug);

/**
 * GET /api/quiz/:slug/related
 * Get related quizzes based on tags
 */
router.get('/:slug/related', getRelatedQuizzes);

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

/**
 * GET /api/quiz/:slug/feedback
 * Query: question_id, answer_id => returns next_question_id (if branching) and correctness for trivia
 */
router.get('/:slug/feedback', getNextQuestionForAnswer);

export default router;
