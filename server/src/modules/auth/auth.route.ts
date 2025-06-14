import { Router } from 'express';
import { loginController, registerController, verifyController } from './auth.controller';
import { validateLogin, validateRegister } from './auth.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateLogin, loginController);
router.post('/register', validateRegister, registerController);
router.get('/verify', requireAuth, verifyController);

export default router;
