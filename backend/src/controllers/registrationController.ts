import { Request, Response } from 'express';
import { registrationService } from '../services/registrationService';

export const registrationController = {
  async registerUserForEvent(req: Request, res: Response) {
    const { eventId, userId, status, ticketIds} = req.body;

    try {
      const registration = await registrationService.registerUserForEvent(eventId, userId, ticketIds);
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user for event' });
    }
  },

  async getRegistrationById(req: Request, res: Response) {
    const registrationId = req.params.id;

    try {
      const registration = await registrationService.getRegistrationById(registrationId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch registration' });
    }
  },

  async updateRegistration(req: Request, res: Response) {
    const registrationId = req.params.id;
    const { status } = req.body;

    try {
      const updatedRegistration = await registrationService.updateRegistration(registrationId, { status });
      res.json(updatedRegistration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update registration' });
    }
  },

  async deleteRegistration(req: Request, res: Response) {
    const registrationId = req.params.id;

    try {
      await registrationService.deleteRegistration(registrationId);
      res.json({ message: 'Registration deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete registration' });
    }
  },

  async getAllRegistrationsForUser(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
      const registrations = await registrationService.getAllRegistrationsForUser(userId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  },
};
