const Salon = require("../models/Salon");

// @desc    Register a new salon
// @route   POST /api/salons
// @access  Private (owner must be logged in)
exports.registerSalon = async (req, res) => {
    try {
        const { name, owner, phone, address, description, email, openingHours } = req.body;

        if (!name || !owner || !address) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Optional: Check if salon with same name already exists
        const exists = await Salon.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Salon already registered" });
        }

        const salon = await Salon.create({
            name,
            owner,
            phone,
            address,
            description,
            email,
            openingHours
        });

        res.status(201).json(salon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all salons
// @route   GET /api/salons
// @access  Public
exports.getSalons = async (req, res) => {
    try {
        const salons = await Salon.find()
            .populate("owner", "name email role") // Populate owner info
            .populate("services") // optional: populate services
            .populate("products"); // optional: populate products

        res.json(salons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update salon details
// @route   PUT /api/salons/:id
// @access  Private (owner only)
exports.updateSalon = async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);

        if (!salon) return res.status(404).json({ message: "Salon not found" });

        salon.name = req.body.name || salon.name;
        salon.owner = req.body.owner || salon.owner;
        salon.phone = req.body.phone || salon.phone;
        salon.address = req.body.address || salon.address;
        salon.description = req.body.description || salon.description;
        salon.email = req.body.email || salon.email;
        salon.openingHours = req.body.openingHours || salon.openingHours;

        const updatedSalon = await salon.save();
        res.json(updatedSalon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

