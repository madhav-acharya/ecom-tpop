import express from 'express';
const router = express.Router();
import { protect, isAdmin } from '../middlewares/auth.js';
import { adminLogin } from '../controllers/AdminController.js';

router.post('/login', protect, isAdmin, adminLogin);
export default router;
