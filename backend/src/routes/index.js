import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import slotRoutes from './slotRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/slots', slotRoutes);
router.use('/bookings', bookingRoutes);
export default router;