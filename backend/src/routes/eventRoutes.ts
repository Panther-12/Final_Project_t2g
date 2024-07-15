import express from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);


router.post('/',authenticateToken, eventController.createEvent);
router.put('/:id',authenticateToken, eventController.updateEvent);
router.delete('/:id',authenticateToken, eventController.deleteEvent);
router.get('/organizer/:organizerId', authenticateToken, eventController.getEventsByOrganizer);
router.get('/user/:userId', eventController.getAllEventsForUser);

export default router;
