import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as bookingController from '../controllers/bookingController.js';

const router = Router();

router.post('/', authenticate, requireRole('customer'), bookingController.createBooking);
router.get('/customer', authenticate, requireRole('customer'), bookingController.listMyBookingsAsCustomer);
router.get('/provider', authenticate, requireRole('provider'), bookingController.listMyBookingsAsProvider);
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);
router.patch('/:id/confirm', authenticate, requireRole('provider'), bookingController.confirmBooking);

export default router;