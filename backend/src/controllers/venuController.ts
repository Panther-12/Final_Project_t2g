import { Request, Response } from 'express';
import { venueService } from '../services/venueService';

export const venueController = {
  async createVenue(req: Request, res: Response) {
    const { name, address, capacity, type } = req.body;

    try {
      const venue = await venueService.createVenue(name, address, capacity, type);
      res.status(201).json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create venue' });
    }
  },

  async getVenueById(req: Request, res: Response) {
    const venueId = req.params.id;

    try {
      const venue = await venueService.getVenueById(venueId);
      if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch venue' });
    }
  },

  async getAllVenues(req: Request, res: Response) {
    try {
      const venues = await venueService.getAllVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch venues' });
    }
  },

  async updateVenue(req: Request, res: Response) {
    const venueId = req.params.id;
    const { name, address, capacity } = req.body;

    try {
      const updatedVenue = await venueService.updateVenue(venueId, { name, address, capacity });
      res.json(updatedVenue);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update venue' });
    }
  },

  async deleteVenue(req: Request, res: Response) {
    const venueId = req.params.id;

    try {
      await venueService.deleteVenue(venueId);
      res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete venue' });
    }
  },
};
