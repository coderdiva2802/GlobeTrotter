import { Router } from 'express';
import { getRegions, searchDestinations } from '../controllers/destination.controller.js';

const router = Router();

router.get('/regions', getRegions);
router.get('/cities/search', searchDestinations);
router.get('/search', searchDestinations);

export default router;
