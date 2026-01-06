import { Router } from 'express';
import * as adsController from '../controllers/ads.controller';

const router = Router();

router.get('/', adsController.getAds);
router.post('/', adsController.createAd);
router.put('/:id', adsController.updateAd);
router.delete('/:id', adsController.deleteAd);
router.post('/:id/impression', adsController.trackImpression);

// Bulk delete
router.post('/bulk-delete', adsController.bulkDeleteAds);

// Get single ad by ID (must be after /bulk-delete to avoid matching)
router.get('/:id', adsController.getAdById);

export default router;
