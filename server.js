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

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies

// ✅ Allow requests from React frontend (Vite runs on :5173)
app.use(
    cors({
      origin: "http://localhost:5173", // your Vite frontend
      credentials: true, // allow cookies/auth headers if needed
    })
);

// ✅ Serve static images (for salon photos)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ✅ Base route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Example test route (you can remove once React is connected)
app.post("/api/authRegister", (req, res) => {
  res.json({ message: "User registered successfully" });
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/orders/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// //import cors from "cors";
//
//
// // Routes
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const salonRoutes = require("./routes/salonRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const productRoutes = require("./routes/productRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
//
// const app = express();
//
//
// // ✅ Connect to MongoDB
// connectDB();
//
// // ✅ Allow requests from your React frontend
// app.use(cors({
//   origin: "http://localhost:5173", // Vite default port
//   credentials: true, // Allow cookies/auth headers if needed
// }));
//
// // Middleware
// // app.use(cors());
// app.use(express.json()); // JSON body parser
//
// // Example route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
//
// // Example route
// app.post("/api/authRegister", (req, res) => {
//   res.json({ message: "User registered successfully" });
// });
//
// // Mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/salons", salonRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/bookings", bookingRoutes);
//
// const PORT = process.env.PORT || 5003;
//
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });









// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
//
// console.log("MONGO_URI:", process.env.MONGO_URI);
//
// const app = express();
//
// // Middleware
// app.use(cors());
// app.use(express.json()); // To parse JSON request bodies
//
// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
//
// // Example route (You can replace this with real routes)
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
//
// const bookingRoutes = require("./routes/bookingRoutes");
// app.use("/api/bookings", bookingRoutes);
//
// // TODO: Add routes like:
// // app.use('/api/bookings', bookingRoutes);
// // app.use('/api/products', productRoutes);
//
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");

// require('dotenv').config();
// const mongoose = require('mongoose');

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// /*app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/appointments", require("./routes/appointmentRoutes"));*/

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// //const productRoutes = require('./routes/productRoutes');
// //app.use('/api/products', productRoutes);
