// routes/categoryRoutes.ts

import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticateToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/',isAdmin, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id',isAdmin, categoryController.updateCategory);
router.delete('/:id',isAdmin, categoryController.deleteCategory);

export default router;
