import express from 'express';
import { addToCart, removeFromCart, getCart, updateCart, removeUsersCart } from '../controllers/CartController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/get', protect, getCart);
router.post('/add', protect,  addToCart);
router.delete('/remove/:id', protect, removeFromCart);
router.delete('/remove', protect, removeUsersCart);
router.put('/update/:id', protect, updateCart);

export default router;
