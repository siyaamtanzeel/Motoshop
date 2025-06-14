import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from '../../types';

interface IUserDoc extends Omit<IUser, '_id'>, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'buyer'], default: 'buyer' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model<IUserDoc>('User', userSchema);
