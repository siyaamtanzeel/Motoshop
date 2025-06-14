import { Router } from 'express';
import { createPayment, paymentCallback } from './payment.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, createPayment);
router.post('/success', paymentCallback);
router.post('/fail', paymentCallback);
router.post('/cancel', paymentCallback);
router.post('/ipn', paymentCallback);

export default router;
