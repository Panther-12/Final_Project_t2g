// routes/categoryRoutes.ts

import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticateToken, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/categories',isAdmin, categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id',isAdmin, categoryController.updateCategory);
router.delete('/categories/:id',isAdmin, categoryController.deleteCategory);

export default router;
