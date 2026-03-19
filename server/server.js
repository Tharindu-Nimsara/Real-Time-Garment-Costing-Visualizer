import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import quoteRoutes from './routes/quoteRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(json());

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/api/quotes', quoteRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
