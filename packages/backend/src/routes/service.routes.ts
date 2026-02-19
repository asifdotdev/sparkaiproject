import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createServiceSchema, updateServiceSchema } from '@sparkai/shared';

const router = Router();

router.get('/', ServiceController.getAll);
router.get('/search', ServiceController.search);
router.get('/:id', ServiceController.getById);
router.post('/', authenticate, authorize('admin'), validate(createServiceSchema), ServiceController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateServiceSchema), ServiceController.update);
router.delete('/:id', authenticate, authorize('admin'), ServiceController.delete);

export default router;
