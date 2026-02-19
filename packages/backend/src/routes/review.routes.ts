import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReviewSchema } from '@sparkai/shared';

const router = Router();

router.post('/', authenticate, authorize('user'), validate(createReviewSchema), ReviewController.create);
router.get('/booking/:bookingId', authenticate, ReviewController.getByBooking);
router.get('/provider/:providerId', ReviewController.getProviderReviews);

export default router;
