import { Router } from 'express';
import {
  register,
  login,
  getMe,
  customerDashboard,
  providerDashboard,
} from '../controllers/authController.js';
import { authenticate, requireRole, attachUser } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, attachUser, getMe);

router.get(
  '/customer/dashboard',
  authenticate,
  requireRole('customer'),
  attachUser,
  customerDashboard
);

router.get(
  '/provider/dashboard',
  authenticate,
  requireRole('provider'),
  attachUser,
  providerDashboard
);

export default router;
