import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://YOUR_PROJECT.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
  }
};

start();