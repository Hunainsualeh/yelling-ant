import { Router } from 'express';
import * as adsController from '../controllers/ads.controller';

const router = Router();

router.get('/', adsController.getAds);
router.post('/', adsController.createAd);
router.put('/:id', adsController.updateAd);
router.delete('/:id', adsController.deleteAd);
router.post('/:id/impression', adsController.trackImpression);

export default router;
