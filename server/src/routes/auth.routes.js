import { Router } from 'express';
import {
  register,
  login,
  refresh,
  getMe,
  logout,
  forgotPassword,
  handleResetPassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { handleAvatarUpload } from '../middleware/upload.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', handleAvatarUpload, validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), handleResetPassword);

export default router;
