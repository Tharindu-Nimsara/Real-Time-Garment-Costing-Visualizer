import express from 'express';
import { calculateAndSaveQuote } from '../controllers/quoteController.js';
import protect from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Only logged-in users can access this now
router.post('/calculate', protect, calculateAndSaveQuote);

export default router;