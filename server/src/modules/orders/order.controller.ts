import { Request, Response } from 'express';
import Order from './order.model';
import Bike from '../bikes/bike.model';
import type { IUser } from '../../types';

// Add user property to Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { bike } = req.body;

    if (!bike) {
      return res.status(400).json({ message: 'Bike ID is required' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the bike exists and is available
    const bikeDoc = await Bike.findById(bike);
    if (!bikeDoc) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    if (!bikeDoc.isActive) {
      return res.status(400).json({ message: 'This bike is not available for purchase' });
    }
    const totalAmount = Number(bikeDoc.price);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error('Invalid bike price');
    }

    const order = await Order.create({
      bike,
      buyer: req.user._id,
      status: 'pending',
      totalAmount: totalAmount,
    });

    await order.populate('bike');
    res.status(201).json(order);
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(400).json({
      message: err.message || 'Order creation failed',
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    const user = req.user as IUser | undefined;
    if (user?.role === 'buyer') filter.buyer = user._id;
    // admin sees all orders
    const orders = await Order.find(filter).populate('bike').populate('buyer');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('bike').populate('buyer');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
