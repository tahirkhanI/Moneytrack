import express from 'express';
import {
  getProfile,
  loginUser,
  loginValidation,
  registerUser,
  registerValidation,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, handleValidation, registerUser);
router.post('/login', loginValidation, handleValidation, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
