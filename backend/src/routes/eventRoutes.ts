import express from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

router.use(authenticateToken);

router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
