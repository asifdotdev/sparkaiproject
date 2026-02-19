import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '@sparkai/shared';

const router = Router();

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', authenticate, authorize('admin'), validate(createCategorySchema), CategoryController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), CategoryController.update);
router.delete('/:id', authenticate, authorize('admin'), CategoryController.delete);

export default router;
