import express from 'express';
import { createOrder, updateOrder, getOrders, getOrderById } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.put('/update/:id', updateOrder);
router.get('/get', getOrders);
router.get('/get/:id', getOrderById);

export default router;
