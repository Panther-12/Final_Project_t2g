import express from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middlewares/auth';


const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);
router.post('/generate-reset-code', userController.generateResetCode);
router.post('/reset-password', userController.resetPassword);

router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', isAdmin, userController.deactivateUser);
router.put('/:id/activate', isAdmin, userController.activateUser);
router.put('/:id/profile', authenticateToken, userController.updateProfile);
router.put('/:id/assign-organizer', isAdmin, userController.assignRoleOrganizer);
router.put('/:id/assign-admin', isAdmin, userController.assignRoleAdmin);

export default router;
