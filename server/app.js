import express, { json } from "express";
import cors from "cors";
import quoteRoutes from "./src/routes/quoteRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/quotes", quoteRoutes);
app.use("/api/users", userRoutes);

export default app;
