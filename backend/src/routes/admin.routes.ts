import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();

/**
 * POST /api/admin/upload
 * Upload images for quiz (hero, questions, results, etc.)
 * Supports multiple files
 */
router.post('/upload', upload.array('images', 10), uploadImage);

/**
 * GET /api/admin/quiz
 * List all quizzes including drafts (admin view)
 */
router.get('/quiz', (req: Request, res: Response) => {
  res.json({
    message: 'Admin quiz list endpoint (to be implemented in Week 3)',
    quizzes: [],
  });
});

/**
 * POST /api/admin/quiz
 * Create new quiz (admin)
 */
router.post('/quiz', (req: Request, res: Response) => {
  res.json({
    message: 'Create quiz endpoint (to be implemented in Week 3)',
  });
});

/**
 * PUT /api/admin/quiz/:slug
 * Update existing quiz (admin)
 */
router.put('/quiz/:slug', (req: Request, res: Response) => {
  res.json({
    message: 'Update quiz endpoint (to be implemented in Week 3)',
  });
});

/**
 * GET /api/admin/analytics/:slug
 * Get quiz analytics
 */
router.get('/analytics/:slug', (req: Request, res: Response) => {
  res.json({
    message: 'Analytics endpoint (to be implemented in Week 4)',
    slug: req.params.slug,
    analytics: {},
  });
});

export default router;
