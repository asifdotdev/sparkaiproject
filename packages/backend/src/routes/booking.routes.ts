import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBookingSchema } from '@sparkai/shared';

const router = Router();

router.post('/', authenticate, authorize('user'), validate(createBookingSchema), BookingController.create);
router.get('/', authenticate, authorize('user', 'provider'), BookingController.getAll);
router.get('/:id', authenticate, authorize('user', 'provider'), BookingController.getById);
router.put('/:id/accept', authenticate, authorize('provider'), BookingController.accept);
router.put('/:id/reject', authenticate, authorize('provider'), BookingController.reject);
router.put('/:id/start', authenticate, authorize('provider'), BookingController.start);
router.put('/:id/complete', authenticate, authorize('provider'), BookingController.complete);
router.put('/:id/cancel', authenticate, authorize('user', 'provider'), BookingController.cancel);

export default router;
