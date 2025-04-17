import express from 'express';
import {
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  applyPromoCode
} from '../controllers/PromoCodeController.js';

const router = express.Router();

router.post('/create', createPromoCode);
router.get('/get', getAllPromoCodes);
router.put('/update/:id', updatePromoCode);
router.delete('/delete/:id', deletePromoCode);
router.post('/apply', applyPromoCode);

export default router;
