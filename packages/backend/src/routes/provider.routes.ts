import { Router } from 'express';
import { ProviderController } from '../controllers/provider.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', ProviderController.getAll);
router.get('/:id', ProviderController.getById);

// Provider-only routes
router.put('/profile', authenticate, authorize('provider'), ProviderController.updateProfile);
router.put('/availability', authenticate, authorize('provider'), ProviderController.toggleAvailability);
router.get('/me/services', authenticate, authorize('provider'), ProviderController.getMyServices);
router.post('/me/services', authenticate, authorize('provider'), ProviderController.addService);
router.delete('/me/services/:serviceId', authenticate, authorize('provider'), ProviderController.removeService);
router.get('/me/dashboard', authenticate, authorize('provider'), ProviderController.getDashboard);

export default router;
