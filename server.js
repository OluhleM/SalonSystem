// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Allow requests from React frontend (Vite runs on :5173)
app.use(
    cors({
      origin: "http://localhost:5173", // your Vite frontend
      credentials: true, // allow cookies/auth headers if needed
    })
);

// Serve static images (for salon photos)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Base route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Example test route (you can remove once React is connected)
app.post("/api/authRegister", (req, res) => {
  res.json({ message: "User registered successfully" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/orders/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

//  Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









