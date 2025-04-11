import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.get("/get", getCategories);
router.post("/create", upload.single('image'), createCategory);
router.get("/get/:id", getCategoryById);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
