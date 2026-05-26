import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getNotificationSettings,
  updateNotificationSettings,
  getSubscription,
  updateSubscription,
  getInvoices,
  verifyOTP
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, changePassword);
router.get('/notifications', authMiddleware, getNotificationSettings);
router.patch('/notifications', authMiddleware, updateNotificationSettings);
router.get('/subscription', authMiddleware, getSubscription);
router.patch('/subscription', authMiddleware, updateSubscription);
router.get('/invoices', authMiddleware, getInvoices);
router.get('/profile', authMiddleware, getProfile);
router.delete('/delete-account', authMiddleware, deleteAccount);
router.post(
  "/verify-otp",
  verifyOTP
  // Cannot find name 'verifyOTP'.
);

export default router;
