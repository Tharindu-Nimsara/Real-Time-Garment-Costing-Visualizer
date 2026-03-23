import express, { json } from "express";
import cors from "cors";
import quoteRoutes from "./src/routes/quoteRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const wildcardToRegex = (pattern) =>
  new RegExp(
    `^${pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")}$`,
  );

const allowedOriginRegexes = allowedOrigins
  .filter((origin) => origin.includes("*"))
  .map(wildcardToRegex);

app.use(
  cors({
    origin: (origin, callback) => {
      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isWildcardAllowed = allowedOriginRegexes.some((regex) =>
        regex.test(origin || ""),
      );

      if (
        !origin ||
        allowedOrigins.length === 0 ||
        isExplicitlyAllowed ||
        isWildcardAllowed
      ) {
        return callback(null, true);
      }

      return callback(null, false);
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
