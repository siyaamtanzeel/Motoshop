import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from './user.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, requireRole(['admin']), getUsers);
router.get('/:id', requireAuth, getUserById);
router.patch('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteUser);

export default router;
