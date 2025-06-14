import { Router } from 'express';
import { getAllNews, getNewsById, createNews, updateNews, deleteNews } from './news.controller';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Admin routes
router.post('/', requireAuth, requireRole(['admin']), upload.single('image'), createNews);
router.put('/:id', requireAuth, requireRole(['admin']), upload.single('image'), updateNews);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteNews);

export default router;
