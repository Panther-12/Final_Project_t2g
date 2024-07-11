import { Response } from 'express';

export const successResponse = (res: Response, statusCode: number, message: string, data?: any) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, error: any) => {
  res.status(500).json({
    success: false,
    message: error.message,
  });
};
