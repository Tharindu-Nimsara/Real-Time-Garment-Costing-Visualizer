import express from "express";
import {
  calculateAndSaveQuote,
  uploadLogo,
} from "../controllers/quoteController.js";
import protect from "../middlewares/authMiddleware.js";
import parseLogoUpload from "../middlewares/uploadMulter.js";
import validateLogoUpload from "../middlewares/uploadValidation.js";

const router = express.Router();

// Only logged-in users can access this now
router.post("/calculate", protect, calculateAndSaveQuote);
router.post(
  "/upload-logo",
  protect,
  parseLogoUpload,
  validateLogoUpload,
  uploadLogo,
);

export default router;
