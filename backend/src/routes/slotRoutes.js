import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as slotController from '../controllers/slotController.js';

const router = Router();

router.post('/', authenticate, requireRole('provider'), slotController.createSlot);
router.get('/mine', authenticate, requireRole('provider'), slotController.listMySlots);
router.get('/service/:serviceId', slotController.listOpenSlotsForService); // public, customers browse

export default router;