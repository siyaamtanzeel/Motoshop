import Order from './order.model';
import { Types } from 'mongoose';

export const updateOrderPaymentStatus = async (orderId: string, paymentStatus: string) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: paymentStatus === 'VALID' ? 'paid' : 'payment_failed',
        updatedAt: new Date(),
      },
      { new: true },
    );
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
