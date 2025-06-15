import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../types';

// Add user property to Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
      req.user = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

export const requireRole =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role: ${roles.join(' or ')}`,
        });
      }

      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return res.status(500).json({ message: 'Server error in role middleware' });
    }
  };
