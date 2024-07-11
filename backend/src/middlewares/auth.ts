import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return {userId: decoded.userId, token: token};
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
