import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import postRoutes from "./routes/posts.routes.js";
import UserRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// Import models to register them with Mongoose
import User from "./models/user.model.js";
import Profile from "./models/profile.model.js";
import Post from "./models/posts.model.js";
import Comment from "./models/comments.model.js";
import Connection from "./models/connections.model.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use(postRoutes);
app.use(UserRoutes);
app.use(aiRoutes);
app.use(express.static('uploads'));

const start = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URL:", process.env.MONGO_URL ? "✓ Loaded" : "✗ Missing");
    
    // Try connecting without database name first
    const testUrl = process.env.MONGO_URL.replace('/linkedin?', '/?');
    console.log("Testing connection to:", testUrl.replace(/\/\/.*@/, '//***:***@'));
    
    const connectDB = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    console.log("MongoDB connected:", connectDB.connection.host);
    console.log("Database name:", connectDB.connection.name);
    
    // List registered models
    console.log("Registered models:", Object.keys(mongoose.models));

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
};

start();
