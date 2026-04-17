import express from 'express';
import {
  getCart,
  addToCart,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/:productId').delete(protect, removeItemFromCart);

export default router;
