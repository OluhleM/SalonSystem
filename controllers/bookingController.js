const Booking = require("../models/Booking");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (or protected if you want only logged-in clients)
exports.createBooking = async (req, res) => {
    try {
        const { clientName, service, date, time, phone } = req.body;

        // Basic validation
        if (!clientName || !service || !date || !time) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Optional: Prevent double booking (same service, same date+time)
        const existingBooking = await Booking.findOne({ service, date, time, status: { $ne: "cancelled" } });
        if (existingBooking) {
            return res.status(400).json({ message: "This time slot is already booked." });
        }

        const booking = new Booking({
            clientName,
            service,
            date,
            time,
            phone,
        });

        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin/Salon
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Public/Admin
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update booking (e.g., confirm/cancel)
// @route   PUT /api/bookings/:id
// @access  Admin/Salon
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.clientName = req.body.clientName || booking.clientName;
        booking.service = req.body.service || booking.service;
        booking.date = req.body.date || booking.date;
        booking.time = req.body.time || booking.time;
        booking.phone = req.body.phone || booking.phone;
        booking.status = req.body.status || booking.status;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Admin/Salon
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json({ message: "Booking removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
