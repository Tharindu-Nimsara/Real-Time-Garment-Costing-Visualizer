import express from "express";
import {
  calculateAndSaveQuote,
  getMyQuotes,
  uploadLogo,
} from "../controllers/quoteController.js";
import parseLogoUpload from "../middlewares/uploadMulter.js";
import validateLogoUpload from "../middlewares/uploadValidation.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyQuotes);
router.post("/calculate", protect, calculateAndSaveQuote);
router.post("/upload-logo", parseLogoUpload, validateLogoUpload, uploadLogo);

export default router;
