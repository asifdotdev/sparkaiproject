import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.put('/users/:id', AdminController.updateUser);
router.get('/providers', AdminController.getAllProviders);
router.put('/providers/:id/verify', AdminController.verifyProvider);
router.get('/bookings', AdminController.getAllBookings);
router.put('/bookings/:id/assign', AdminController.assignProvider);
router.get('/payments', AdminController.getAllPayments);
router.get('/reviews', AdminController.getAllReviews);
router.delete('/reviews/:id', AdminController.deleteReview);

export default router;
