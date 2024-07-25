import { Router } from 'express';
import { ticketController } from '../controllers/ticketController';
import { isOrganizer, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('', isOrganizer, ticketController.createTicket);
router.get('/', isAdmin, ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', isOrganizer, ticketController.updateTicket);
router.delete('/:id', isOrganizer, ticketController.deleteTicket);
router.get('/events/:eventId', ticketController.getAllTicketsForEvent);
router.get('/organizer/:organizerId/tickets', ticketController.getAllTicketsForOrganizer);

export default router;
