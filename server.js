require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parser

// Example route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});









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
