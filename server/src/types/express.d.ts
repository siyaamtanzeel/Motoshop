import { Request } from 'express';
import { Document } from 'mongoose';

interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
