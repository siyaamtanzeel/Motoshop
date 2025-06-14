import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import SSLCommerzPayment from 'sslcommerz-lts';
import Order from '../orders/order.model';

interface User {
  _id: string;
  email: string;
}

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: User;
  }
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, shippingDetails } = req.body;

    console.log('Payment Request:', { orderId, shippingDetails });

    if (!process.env.SSLC_STORE_ID || !process.env.SSLC_STORE_PASS) {
      console.error('SSL Commerz credentials missing');
      return res.status(500).json({ message: 'Payment gateway not configured' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new Error('Unauthorized access to order');
    }
    if (order.status !== 'pending') {
      throw new Error('Order is not in pending state');
    }

    const sslcz = new SSLCommerzPayment(
      process.env.SSLC_STORE_ID,
      process.env.SSLC_STORE_PASS,
      false,
    );
    const tran_id = uuidv4();
    const data = {
      total_amount: String(order.totalAmount),
      currency: 'BDT',
      tran_id,
      success_url: `${process.env.BASE_URL}/api/payments/success`,
      fail_url: `${process.env.BASE_URL}/api/payments/fail`,
      cancel_url: `${process.env.BASE_URL}/api/payments/cancel`,
      ipn_url: `${process.env.BASE_URL}/api/payments/ipn`,
      shipping_method: 'NO',
      product_name: 'Motorcycle',
      product_category: 'Vehicle',
      product_profile: 'physical-goods',
      cus_name: String(shippingDetails.name),
      cus_email: String(req.user.email),
      cus_add1: String(shippingDetails.address),
      cus_phone: String(shippingDetails.phone),
      ship_name: String(shippingDetails.name),
      ship_add1: String(shippingDetails.address),
      ship_city: String(shippingDetails.city),
      ship_postcode: String(shippingDetails.postcode),
      ship_country: 'Bangladesh',
      value_a: String(orderId), // Store orderId for reference
    };

    console.log('Initiating payment with data:', { ...data, orderId });
    try {
      const apiResponse = await sslcz.init(data);
      console.log('Payment init response:', apiResponse);

      if (!apiResponse?.GatewayPageURL) {
        console.error('Failed to get gateway URL:', apiResponse);
        return res.status(500).json({
          message: 'Failed to initialize payment',
          error: apiResponse.failedreason || 'Unknown error',
        });
      } // Validate payment amount against order totalAmount
      const orderAmount = order.totalAmount;
      if (!orderAmount || Number(data.total_amount) !== orderAmount) {
        console.error('Amount mismatch:', {
          expected: orderAmount,
          received: Number(data.total_amount),
        });
        throw new Error('Payment amount mismatch');
      }

      // Update order with payment ID
      await Order.findByIdAndUpdate(orderId, {
        paymentId: tran_id,
        status: 'pending',
        shippingDetails: shippingDetails,
      });

      res.json({
        url: apiResponse.GatewayPageURL,
        transactionId: tran_id,
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      return res.status(500).json({
        message: 'Payment gateway error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error: unknown) {
    console.error('Payment initiation failed:', error);
    const err = error as Error;
    res.status(500).json({
      message: err.message || 'Payment initiation failed',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

export const paymentCallback = async (req: Request, res: Response) => {
  try {
    const { status, tran_id, value_a } = req.body;
    console.log('Payment callback received:', req.body);

    // Find order by transaction ID and orderId (value_a)
    const order = await Order.findOne({
      paymentId: tran_id,
      _id: value_a,
    });

    if (!order) {
      return res.redirect(
        `${process.env.CLIENT_URL}/error?message=Order not found for transaction`,
      );
    } // Validate payment amount and currency
    const { amount, currency } = req.body;
    if (Number(amount) !== order.totalAmount || currency !== 'BDT') {
      console.error('Payment validation failed:', {
        expectedAmount: order.totalAmount,
        receivedAmount: amount,
        currency,
      });
      await Order.findByIdAndUpdate(order._id, {
        status: 'failed',
        failureReason: 'Amount or currency mismatch',
      });
      return res.redirect(
        `${process.env.CLIENT_URL}/orders/${order._id}?status=failed&reason=validation`,
      );
    }

    // Update order status based on payment status
    let redirectUrl = `${process.env.CLIENT_URL}/orders/${order._id}?status=failed`;
    if (status === 'VALID' || status === 'VALIDATED') {
      await Order.findByIdAndUpdate(order._id, {
        status: 'paid',
        paidAt: new Date(),
      });
      redirectUrl = `${process.env.CLIENT_URL}/orders/${order._id}?status=success`;
    } else {
      await Order.findByIdAndUpdate(order._id, {
        status: 'failed',
        failureReason: status,
      });
    }
    // ব্রাউজার রিডাইরেক্ট
    res.redirect(redirectUrl);
  } catch (error: unknown) {
    console.error('Payment callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/error?message=Payment processing failed`);
  }
};
