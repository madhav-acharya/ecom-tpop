import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/get', getProducts);
router.post('/add', upload.array('images', 10), addProduct);
router.get('/get/:id', getProductById);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.post('/upload', upload.array('images', 10), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const filePaths = req.files.map(file => file.path);
  res.status(200).json({ filePaths });
});

export default router;
