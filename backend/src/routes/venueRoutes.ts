import express from 'express';
import { venueController } from '../controllers/venuController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);

router.use(authenticateToken)

router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);

export default router;
