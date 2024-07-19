import express from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken, isOrganizer } from '../middlewares/auth';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);


router.post('/',isOrganizer, eventController.createEvent);
router.put('/:id',isOrganizer, eventController.updateEvent);
router.delete('/:id',isOrganizer, eventController.deleteEvent);
router.get('/organizer/:organizerId', isOrganizer, eventController.getEventsByOrganizer);
router.get('/user/:userId',authenticateToken, eventController.getAllEventsForUser);

export default router;
