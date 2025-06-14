import { Router } from 'express';
import {
  getDashboardStats,
  manageUsers,
  manageBikes,
  manageOrders,
  toggleUserBlock,
  changeUserRole,
  deleteUser,
  updateHomepageContent,
} from './admin.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', requireAuth, requireRole(['admin']), getDashboardStats);
router.get('/users', requireAuth, requireRole(['admin']), manageUsers);
router.get('/bikes', requireAuth, requireRole(['admin']), manageBikes);
router.get('/orders', requireAuth, requireRole(['admin']), manageOrders);

// New admin routes for user management
router.put('/users/:id/toggle-block', requireAuth, requireRole(['admin']), toggleUserBlock);
router.put('/users/:id/role', requireAuth, requireRole(['admin']), changeUserRole);
router.delete('/users/:id', requireAuth, requireRole(['admin']), deleteUser);

// Homepage content management
router.put('/homepage-content', requireAuth, requireRole(['admin']), updateHomepageContent);

export default router;
