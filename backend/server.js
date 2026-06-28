import express from "express";
const app = express();

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import postRoutes from "./routes/post.routes.js";

import userRoutes from "./routes/user.routes.js";





app.use(
  cors({
    origin: "http://localhost:3000",
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

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });

  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
    
  }
};



start();
