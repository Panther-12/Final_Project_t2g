import express from 'express';
import { registrationController } from '../controllers/registrationController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Secure routes below require authentication
router.use(authenticateToken);

router.post('/', registrationController.registerUserForEvent);
router.get('/:id', registrationController.getRegistrationById);
router.put('/:id', registrationController.updateRegistration);
router.delete('/:id', registrationController.deleteRegistration);
router.get('/user/:userId', registrationController.getAllRegistrationsForUser);

export default router;
