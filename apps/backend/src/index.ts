// src/index.ts
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/socialapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.get("/", (req, res) => {
    res.send("API is running!");
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
