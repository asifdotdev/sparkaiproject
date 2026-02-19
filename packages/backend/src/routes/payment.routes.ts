import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/initiate', authenticate, authorize('user'), PaymentController.initiate);
router.get('/booking/:bookingId', authenticate, PaymentController.getByBooking);
router.get('/:id', authenticate, PaymentController.getById);

export default router;
