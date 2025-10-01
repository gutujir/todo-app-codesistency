import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import todoRouter from "./routes/todo.route.js";

dotenv.config();

const app = express();

const devOrigin = "http://localhost:5173";
const prodOrigin = process.env.CLIENT_URL;
const allowedOrigins = [devOrigin];
if (prodOrigin) allowedOrigins.push(prodOrigin);
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRouter);

export default app;
