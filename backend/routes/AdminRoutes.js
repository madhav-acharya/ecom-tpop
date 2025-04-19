import express from 'express';
const router = express.Router();
import { protect, isAdmin } from '../middlewares/auth.js';
import { adminLogin, 
    getDashboardStats,
    getMonthlySalesOverview,
    getWeeklySalesOverview,
    getDailySalesOverview,
    getHourlySalesOverview,
    getMinutelySalesOverview,
    getProductCategories,
    getOrderStatusSummary,
    getRecentOrders } from '../controllers/AdminController.js';

router.post('/login', protect, isAdmin, adminLogin);
router.get('/dashboard-stats', getDashboardStats);
router.get('/sales/hourly', getHourlySalesOverview);
router.get('/sales/minutely', getMinutelySalesOverview);
router.get('/sales/daily', getDailySalesOverview);
router.get('/sales/weekly', getWeeklySalesOverview);
router.get('/sales/monthly', getMonthlySalesOverview);
router.get('/product-categories', getProductCategories);
router.get('/order-status-summary', getOrderStatusSummary);
router.get('/recent-orders', getRecentOrders);
export default router;
