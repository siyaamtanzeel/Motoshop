import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};
