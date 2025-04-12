// routes/userRoutes.js
import express from 'express';
import { signup, login, currentUser, getUserById, getUsers, updateUser, deleteUser, uploadImage } from '../controllers/UserController.js';
import upload from '../middlewares/multer.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/get/me', protect, currentUser);
router.get('/get/:id', getUserById);
router.get('/get', getUsers);
router.put('/update/:id', updateUser);
router.put('/update/image/:id', upload.single("profileImage"), uploadImage);
router.delete('/delete/:id', deleteUser);

export default router;