import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { generateAccessToken } from '../middlewares/auth';
import bcrypt from 'bcrypt';

export const userController = {
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const isValid = await userService.verifyPassword(email, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = await userService.getUserByEmail(email);
      const accessToken = generateAccessToken(user.id);

      res.json({ accessToken });
    } catch (error) {
      res.status(500).json({ error: 'Failed to authenticate' });
    }
  },

  async createUser(req: Request, res: Response) {
    const { email, password, role } = req.body;

    try {
      const user = await userService.createUser(email, password, role);
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

      // Check permissions if needed
      if (req.params.userId !== user.id && req.params.userRole !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
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


  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      await userService.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
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
};
