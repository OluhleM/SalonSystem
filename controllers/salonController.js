const Salon = require("../models/Salon");
const User = require("../models/User");

// @desc    Register a new salon
// @route   POST /api/salons
// @access  Private (admin only)
exports.registerSalon = async (req, res) => {
    try {
        const { name, ownerEmail, phone, address, description, email, openingHours } = req.body;

        if (!name || !ownerEmail || !address || !openingHours?.start || !openingHours?.end) {
            return res.status(400).json({ message: "Required fields missing or invalid opening hours" });
        }

        // Find the user by email
        const owner = await User.findOne({ email: ownerEmail });
        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Register the user first." });
        }

        // Check if salon with same name already exists
        const exists = await Salon.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Salon already registered" });
        }

        const salon = await Salon.create({
            name,
            owner: owner._id,
            phone,
            address,
            description,
            email,
            openingHours
        });

        res.status(201).json(salon);
    } catch (err) {
        console.error("Register salon error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get all salons
// @route   GET /api/salons
// @access  Public
exports.getSalons = async (req, res) => {
    try {
        const salons = await Salon.find()
            .populate("owner", "name email role")
            .populate("services")
            .populate("products");

        res.json(salons);
    } catch (err) {
        console.error("Get salons error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get salon by ID
// @route   GET /api/salons/:id
// @access  Public
exports.getSalonById = async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id)
            .populate("owner", "name email role")
            .populate("services")
            .populate("products");

        if (!salon) return res.status(404).json({ message: "Salon not found" });
        res.json(salon);
    } catch (err) {
        console.error("Get salon by ID error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update salon details
// @route   PUT /api/salons/:id
// @access  Private (owner/admin)
exports.updateSalon = async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);
        if (!salon) return res.status(404).json({ message: "Salon not found" });

        // Update basic fields
        salon.name = req.body.name || salon.name;
        salon.phone = req.body.phone || salon.phone;
        salon.address = req.body.address || salon.address;
        salon.description = req.body.description || salon.description;
        salon.email = req.body.email || salon.email;
        salon.openingHours = req.body.openingHours || salon.openingHours;

        // Update owner by email if provided
        if (req.body.ownerEmail) {
            const owner = await User.findOne({ email: req.body.ownerEmail });
            if (owner) salon.owner = owner._id;
        }

        const updatedSalon = await salon.save();
        res.json(updatedSalon);
    } catch (err) {
        console.error("Update salon error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a salon
// @route   DELETE /api/salons/:id
// @access  Private (owner/admin)
exports.deleteSalon = async (req, res) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);
        if (!salon) return res.status(404).json({ message: "Salon not found" });

        res.json({ message: "Salon removed" });
    } catch (err) {
        console.error("Delete salon error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


