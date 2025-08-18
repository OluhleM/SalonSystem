const express = require("express");
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;











// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/Booking");
//
// // POST /api/bookings - create a new booking
// router.post("/", async (req, res) => {
//   try {
//     const booking = new Booking(req.body);
//     const saved = await booking.save();
//     console.log("✅ Booking saved to DB:", saved);  // <-- ADD THIS
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("❌ Error saving booking:", err); // <-- ADD THIS
//     res.status(400).json({ error: err.message });
//   }
// });
//
//
// // GET /api/bookings - get all bookings
// router.get("/", async (req, res) => {
//   try {
//     const bookings = await Booking.find().sort({ createdAt: -1 });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
//
// // PUT /api/bookings/:id - update a booking
// router.put("/:id", async (req, res) => {
//   try {
//     console.log("📥 Update body:", req.body);
//     console.log("🔑 Booking ID:", req.params.id);
//
//     const updatedBooking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//
//     if (!updatedBooking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }
//
//     res.json(updatedBooking);
//   } catch (err) {
//     console.error("❌ Update error:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// });
//
//
//
// module.exports = router;
