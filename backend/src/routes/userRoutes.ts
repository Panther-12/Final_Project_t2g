import express from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';


const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);

// Secure routes below require authentication
router.use(authenticateToken);

router.put('/profile', userController.updateProfile);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
