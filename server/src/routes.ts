import { Router } from 'express';
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/users/user.route';
import bikeRoutes from './modules/bikes/bike.route';
import paymentRoutes from './modules/payments/payment.route';
import orderRoutes from './modules/orders/order.route';
import adminRoutes from './modules/admin/admin.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bikes', bikeRoutes);
router.use('/payments', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
