import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as serviceController from '../controllers/serviceController.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('provider'));

router.post('/', serviceController.createService);
router.get('/', serviceController.listMyServices);
router.patch('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;