import express from 'express';
import {
  getCurrentUser,
  googleAuth,
  googleCallback
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Google OAuth routes (public)
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes (authentication required)
router.use(authenticate); // Apply authentication middleware to all routes below

router.get('/me', getCurrentUser);

export default router;