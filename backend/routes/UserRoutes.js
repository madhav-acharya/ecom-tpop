// routes/userRoutes.js
import express from 'express';
import { signup, login, currentUser, getUserById, getUsers, updateUser, deleteUser } from '../controllers/UserController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/get/me', protect, currentUser);
router.get('/get/:id', getUserById);
router.get('/get', getUsers);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;