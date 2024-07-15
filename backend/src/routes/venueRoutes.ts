import express from 'express';
import { venueController } from '../controllers/venuController';
import { authenticateToken, isAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);

router.post('/',isAdmin, venueController.createVenue);
router.put('/:id',isAdmin, venueController.updateVenue);
router.delete('/:id',isAdmin, venueController.deleteVenue);

export default router;
