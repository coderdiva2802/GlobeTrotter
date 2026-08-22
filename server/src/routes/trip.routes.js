import { Router } from 'express';
import { getUserTrips, createTrip } from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/user', getUserTrips);
router.post('/', createTrip);

export default router;
