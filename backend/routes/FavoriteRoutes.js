import express from 'express';
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/FavoriteController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/get', protect, getFavorites);
router.post('/add', protect, addToFavorites);
router.post('/remove', protect, removeFromFavorites);

export default router;
