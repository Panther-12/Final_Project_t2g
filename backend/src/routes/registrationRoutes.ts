import express from 'express';
import { registrationController } from '../controllers/registrationController';
import { authenticateToken, isAdmin, isOrganizer } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticateToken, registrationController.registerUserForEvent);
router.get('/', isAdmin, registrationController.getAllRegistrations);
router.get('/:id', authenticateToken, registrationController.getRegistrationById);
router.put('/:id', authenticateToken, registrationController.updateRegistration);
router.delete('/:id', authenticateToken, registrationController.deleteRegistration);
router.get('/user/:userId', authenticateToken, registrationController.getAllRegistrationsForUser);
router.get('/organizer/:organizerId', isOrganizer, registrationController.getAllRegistrationsByOrganizer);

export default router;
