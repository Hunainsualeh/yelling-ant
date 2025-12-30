import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { uploadImage } from '../controllers/upload.controller';
import {
  getAdminQuizList,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  scheduleQuiz,
  rollbackQuiz,
  getImageList,
  getQuizAnalytics,
  configureAds,
  getQuizVersions,
  configureSponsorship,
  getQuizPreview,
  
} from '../controllers/admin.controller';
import { validateQuizPayload } from '../middleware/quizValidation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/admin/upload
 * Upload images for quiz (hero, questions, results, etc.)
 * Supports multiple files
 */
router.post('/upload', authMiddleware, upload.array('images', 10), uploadImage);

/**
 * GET /api/admin/images
 * List all uploaded images
 */
router.get('/images', authMiddleware, getImageList);

/**
 * GET /api/admin/quiz
 * List all quizzes including drafts (admin view)
 * Query params: ?status=draft&limit=50&offset=0
 */
router.get('/quiz', getAdminQuizList);

/**
 * POST /api/admin/quiz
 * Create new quiz (admin)
 */
router.post('/quiz', authMiddleware, validateQuizPayload, createQuiz);
/**
 * PUT /api/admin/quiz/:slug
 * Update existing quiz (admin)
 */
router.put('/quiz/:slug', authMiddleware, validateQuizPayload, updateQuiz);

/**
 * POST /api/admin/quiz/:slug/ads
 * Configure ad slots for a quiz
 */
router.post('/quiz/:slug/ads', authMiddleware, configureAds);

/**
 * GET /api/admin/quiz/:slug/preview
 */
router.get('/quiz/:slug/preview', authMiddleware, getQuizPreview);

/**
 * PUT /api/admin/quiz/:slug
 * Update existing quiz (admin)
 */
router.put('/quiz/:slug', authMiddleware, updateQuiz);

/**
 * DELETE /api/admin/quiz/:slug
 * Delete (archive) quiz (admin)
 */
router.delete('/quiz/:slug', authMiddleware, deleteQuiz);

/**
 * PATCH /api/admin/quiz/:slug/publish
 * Publish or unpublish quiz
 * Body: { "publish": true/false }
 */
router.patch('/quiz/:slug/publish', authMiddleware, publishQuiz);

/**
 * POST /api/admin/quiz/:slug/schedule
 * Schedule quiz for future publication
 * Body: { "publish_at": "2025-12-01T10:00:00Z" }
 */
router.post('/quiz/:slug/schedule', authMiddleware, scheduleQuiz);

/**
 * POST /api/admin/quiz/:slug/rollback
 * Rollback to previous version
 * Body: { "version": 3 }
 */
router.post('/quiz/:slug/rollback', authMiddleware, rollbackQuiz);

/**
 * GET /api/admin/versions/:slug
 */
router.get('/versions/:slug', authMiddleware, getQuizVersions);

/**
 * POST /api/admin/quiz/:slug/sponsor
 * Configure sponsorship for a quiz (stored in `quiz_data.sponsorship`)
 */
router.post('/quiz/:slug/sponsor', authMiddleware, configureSponsorship);

/**
 * GET /api/admin/analytics/:slug
 * Get quiz analytics
 */
router.get('/analytics/:slug', authMiddleware, getQuizAnalytics);

export default router;
