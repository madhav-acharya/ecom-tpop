import { createReview, deleteReview, updateReview, getAllReviews, getReviewById, getReviewsByProductId } from "../controllers/ReviewController.js";
import express from "express";
import { protect } from "../middlewares/auth.js";
const router = express.Router();

router.post("/create", createReview);
router.get("/get", getAllReviews);
router.put("/update/:id",  updateReview);
router.delete("/delete/:id", deleteReview);
router.get("/get/:id", getReviewById);
router.get("/get/product/:productId", getReviewsByProductId);

export default router;