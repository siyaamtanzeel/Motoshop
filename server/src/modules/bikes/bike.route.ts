import { Router } from 'express';
import { createBike, getBikes, getBikeById, updateBike, deleteBike } from './bike.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getBikes);
router.get('/:id', getBikeById);
router.post('/', requireAuth, requireRole(['admin']), createBike);
router.patch('/:id', requireAuth, requireRole(['admin']), updateBike);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteBike);

export default router;
