const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Application = require("../models/Application");

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Middleware
app.use(
  cors({
    origin: [
      "https://placement-pro-three-teal.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("PlacementPro Backend is Running 🚀");
});

// GET Applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Application
app.post("/applications", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const application = new Application(req.body);

    const savedApplication = await application.save();

    res.status(201).json(savedApplication);
  } catch (err) {
    console.error(err);   // 👈 This is important
    res.status(500).json({
      message: err.message,
      error: err,
    });
  }
});

// UPDATE Application
app.put("/applications/:id", async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Application
app.delete("/applications/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application Deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;