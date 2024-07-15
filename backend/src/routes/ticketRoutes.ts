import { Router } from 'express';
import { ticketController } from '../controllers/ticketController';
import { isOrganizer, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/tickets', isOrganizer, ticketController.createTicket);
router.get('/tickets/:id', ticketController.getTicketById);
router.put('/tickets/:id', isOrganizer, ticketController.updateTicket);
router.delete('/tickets/:id', isOrganizer, ticketController.deleteTicket);
router.get('/tickets', isAdmin, ticketController.getAllTickets);
router.get('/events/:eventId/tickets', ticketController.getAllTicketsForEvent);

export default router;
