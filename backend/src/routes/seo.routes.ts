import { Router } from 'express';
import { getSeoMetadata } from '../controllers/seo.controller';

const router = Router();

/**
 * GET /api/seo/:slug
 */
router.get('/:slug', getSeoMetadata);

export default router;
