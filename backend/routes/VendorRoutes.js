import express from "express";
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/VendorController.js";

const router = express.Router();
router.get("/get", getVendors);
router.post("/create", createVendor);
router.get("/get/:id", getVendorById);
router.put("/update/:id", updateVendor);
router.delete("/delete/:id", deleteVendor);

export default router;
