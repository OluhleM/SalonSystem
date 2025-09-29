const Booking = require("../models/Booking");
const User = require("../models/User");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (or protected if needed)
exports.createBooking = async (req, res) => {
    try {
        const { customer, salon, service, bookingDateTime, phone, price, notes } = req.body;

        // Basic validation
        if (!customer || !salon || !service || !bookingDateTime || !price) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Find the referenced documents
        const customerDoc = await User.findOne({ email: new RegExp(`^${customer}$`, "i") });
        const salonDoc = await Salon.findOne({ name: new RegExp(`^${salon}$`, "i") });
        const serviceDoc = await Service.findOne({ name: new RegExp(`^${service}$`, "i") });

        console.log("Found customerDoc:", customerDoc);
        console.log("Found salonDoc:", salonDoc);
        console.log("Found serviceDoc:", serviceDoc);

        if (!customerDoc || !salonDoc || !serviceDoc) {
            return res.status(400).json({ message: "Invalid customer email, salon, or service" });
        }

        // Optional: prevent double booking
        const existingBooking = await Booking.findOne({
            salon: salonDoc._id,
            service: serviceDoc._id,
            bookingDateTime,
            status: { $ne: "cancelled" }
        });
        if (existingBooking) {
            return res.status(400).json({ message: "This time slot is already booked." });
        }

        // Create booking with resolved IDs
        const booking = new Booking({
            customer: customerDoc._id,
            salon: salonDoc._id,
            service: serviceDoc._id,
            bookingDateTime,
            phone,
            price,
            notes,
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
        const bookings = await Booking.find()
            .populate("customer", "name email")       // only return name + email
            .populate("salon", "name")                // only return salon name
            .populate("service", "name price")        // only return service name + price
            .sort({ bookingDateTime: 1 });

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Public/Admin
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("customer", "name email")
            .populate("salon", "name")
            .populate("service", "name price");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (err) {
        console.error(err);
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
