import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./app.js";

dotenv.config();
const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
