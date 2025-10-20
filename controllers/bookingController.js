const Booking = require("../models/Booking");
const User = require("../models/User");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Protected (requires authenticated user)
exports.createBooking = async (req, res) => {
    try {
        //  must have authenticated user
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { salon, service, bookingDateTime, phone, notes } = req.body;

        const customer = req.user.id; // safe to use

        if (!customer || !salon || !service || !bookingDateTime) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const [customerDoc, salonDoc, serviceDoc] = await Promise.all([
            User.findById(customer),
            Salon.findById(salon),
            Service.findById(service)
        ]);

        if (!customerDoc || !salonDoc || !serviceDoc) {
            return res.status(400).json({ message: "Invalid customer, salon, or service ID" });
        }

        const existingBooking = await Booking.findOne({
            salon: salonDoc._id,
            service: serviceDoc._id,
            bookingDateTime,
            status: { $ne: "cancelled" }
        });
        if (existingBooking) {
            return res.status(400).json({ message: "This time slot is already booked." });
        }

        const booking = new Booking({
            customer: customerDoc._id,
            salon: salonDoc._id,
            service: serviceDoc._id,
            bookingDateTime,
            phone,
            price: serviceDoc.price,
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
            .populate("customer", "name email")
            .populate("salon", "name")
            .populate("service", "name price")
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

        const { status, paymentStatus, notes } = req.body;
        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        if (notes !== undefined) booking.notes = notes;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (err) {
        console.error(err);
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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};