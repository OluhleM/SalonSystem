// src/routes/bookingRoutes.js
const express = require("express");
const {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware"); // ✅ ADDED: import middleware

const router = express.Router();

// ✅ Existing routes
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", protect, createBooking); // ✅ ADDED: 'protect' middleware
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

// ✅ NEW: Get booked time slots for a salon on a specific date
router.get("/slots", async (req, res) => {
    try {
        const { salon, date } = req.query;

        if (!salon || !date) {
            return res.status(400).json({ error: "salon and date are required" });
        }

        // Parse date and create start/end of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find all bookings for this salon on this date
        const bookings = await require("../models/Booking").find({
            salon,
            bookingDateTime: { $gte: startOfDay, $lte: endOfDay }
        }).select("bookingDateTime");

        // Extract time strings (e.g., "09:00")
        const bookedSlots = bookings.map(booking => {
            const dt = new Date(booking.bookingDateTime);
            return dt.toTimeString().slice(0, 5); // "HH:MM"
        });

        res.json({ bookedSlots });
    } catch (err) {
        console.error("Error fetching booked slots:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;