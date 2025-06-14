import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from './order.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.post('/', requireAuth, createOrder);
router.patch('/:id/status', requireAuth, requireRole(['admin', 'seller']), updateOrderStatus);

export default router;
