import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import serviceRoutes from './service.routes';
import providerRoutes from './provider.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/providers', providerRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

export default router;
