import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { generateAccessToken } from '../middlewares/auth';
import bcrypt from 'bcrypt';
import { user } from '../interfaces/interfaces';
import { sendRegistrationConfirmationEmail } from '../utils/emailUtils';
import { User } from '@prisma/client';

export const userController = {
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const isValid = await userService.verifyPassword(email, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = await userService.getUserByEmail(email) as User;
      if (user?.accountStatus === 'deactivated') {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      const accessToken = generateAccessToken(user.id);
      res.json({ token: accessToken, userId: user.id, role: user.role });
    } catch (error) {
      res.status(500).json({ error: 'Failed to authenticate' });
    }
  },

  async createUser(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = await userService.createUser(firstName, lastName, email, password, 'user');
      if (user) sendRegistrationConfirmationEmail(user.email, firstName)
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  async getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    const { email, password } = req.body;

    try {
      let hashedPassword: string | undefined;
      if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      const updatedUser = await userService.updateUser(userId, { email, password: hashedPassword });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  },


  async deactivateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deactivatedUser = await userService.deactivateUser(id);
      res.status(200).json(deactivatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to deactivate account' });
    }
  },

  async activateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const activatedUser = await userService.activateUser(id);
      res.status(200).json(activatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to activate account' });
    }
  },


  async updateProfile(req: Request, res: Response) {
    const userId = req.params.id;
    const { firstName, lastName, bio, phone, image } = req.body;

    try {
      const updatedProfile = await userService.updateUserProfile(userId, { firstName, lastName, bio, phone, image });
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },

  async assignRoleOrganizer (req: Request, res: Response){
    const userId = req.params.id
    try{
      const assignOrganizer = await userService.assignRoleOrganizer(userId)
      res.json(assignOrganizer)
    } catch(error){
      res.status(500).json({ error: 'Failed to assign user role organizer'})
    }
  },
  async assignRoleAdmin (req: Request, res: Response){
    const userId = req.params.id
    try{
      const assignAdmin = await userService.assignRoleAdmin(userId)
      res.json(assignAdmin)
    } catch(error){
      res.status(500).json({ error: 'Failed to assign user role admin'})
    }
  },

  async generateResetCode(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await userService.generateAndStoreResetCode(email);
      res.status(200).json({ message: 'Reset code sent to email', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate reset code' });
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { resetCode, email, newPassword } = req.body;

    try {
      const user = await userService.resetPassword(resetCode, email, newPassword);
      res.status(200).json({ message: 'Password reset successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset password' });
    }
  },

  async getAllUsersExceptAdmins(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsersExceptAdmins();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  },

  async getAttendeesForOrganizerEvents(req: Request, res: Response){
    const { organizerId } = req.params;
    try {
      const attendees = await userService.getAttendeesForOrganizerEvents(organizerId);
      res.status(200).json(attendees);
    } catch (error) {
      console.error('Error fetching attendees for organizer events', error);
      res.status(500).json({ error: 'Failed to fetch attendees for organizer events' });
    }
  }
};
