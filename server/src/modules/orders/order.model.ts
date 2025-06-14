import { Schema, model, Document, Types } from 'mongoose';
import { IOrder } from '../../types';

interface IOrderDoc extends Omit<IOrder, '_id'>, Document {
  _id: Types.ObjectId;
}

const orderSchema = new Schema<IOrderDoc>(
  {
    buyer: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
    bike: { type: Schema.Types.ObjectId as any, ref: 'Bike', required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentId: { type: String },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true },
);

export default model<IOrderDoc>('Order', orderSchema);
