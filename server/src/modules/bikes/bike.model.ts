import { Schema, model, Document, Types } from 'mongoose';
import { IBike } from '../../types';

interface IBikeDoc extends Omit<IBike, '_id'>, Document {
  _id: Types.ObjectId;
}

const bikeSchema = new Schema<IBikeDoc>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    seller: { type: Schema.Types.ObjectId as any, ref: 'User', required: true }, // always admin
    specifications: { type: Object, default: {} },
    category: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model<IBikeDoc>('Bike', bikeSchema);
