const Salon = require("../models/Salon");
const User = require("../models/User");

// @desc    Register a new salon
// @route   POST /api/salons
// @access  Private (admin/owner)
exports.registerSalon = async (req, res) => {
    try {
        const { name, ownerEmail, phone, address, description, email, openingHours, imageURL } = req.body;

        // Validate required fields
        if (!name || !ownerEmail || !address) {
            return res.status(400).json({ message: "Name, owner email, and address are required." });
        }

        if (openingHours && (!openingHours.start || !openingHours.end)) {
            return res.status(400).json({ message: "Opening hours must include both start and end times." });
        }

        // Verify owner exists
        const owner = await User.findOne({ email: ownerEmail });
        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register the user first." });
        }

        // Check for duplicate salon name
        const existingSalon = await Salon.findOne({ name });
        if (existingSalon) {
            return res.status(400).json({ message: "A salon with this name already exists." });
        }

        // Create salon
        const salon = await Salon.create({
            name,
            owner: owner._id,
            ownerEmail, // ✅ Critical for frontend
            phone,
            address,
            description,
            email,
            openingHours,
            imageURL

        });

        res.status(201).json(salon);
    } catch (err) {
        console.error("Register salon error:", err);
        res.status(500).json({ message: "Server error while registering salon." });
    }
};

// @desc    Get all salons (public)
// @route   GET /api/salons
// @access  Public
exports.getSalons = async (req, res) => {
    try {
        // Only populate owner (safe); skip services/products until implemented
        const salons = await Salon.find()
            .populate("owner", "name email")
            .select('-__v'); // Exclude __v for cleaner response

        res.json(salons);
    } catch (err) {
        console.error("Get salons error:", err);
        res.status(500).json({ message: "Server error while fetching salons." });
    }
};

// @desc    Get salon by ID
// @route   GET /api/salons/:id
// @access  Public
exports.getSalonById = async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id)
            .populate("owner", "name email")
            .select('-__v');

        if (!salon) {
            return res.status(404).json({ message: "Salon not found." });
        }

        res.json(salon);
    } catch (err) {
        console.error("Get salon by ID error:", err);
        res.status(500).json({ message: "Server error while fetching salon details." });
    }
};

// @desc    Update salon details
// @route   PUT /api/salons/:id
// @access  Private (owner/admin)
exports.updateSalon = async (req, res) => {
    try {
        const { name, ownerEmail, phone, address, description, email, openingHours, imageURL } = req.body;

        const salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: "Salon not found." });
        }

        // Update fields
        if (name) salon.name = name;
        if (phone) salon.phone = phone;
        if (address) salon.address = address;
        if (description !== undefined) salon.description = description;
        if (email) salon.email = email;
        if (openingHours) salon.openingHours = openingHours;
        if (imageURL !== undefined) salon.imageURL = imageURL;

        // Update owner if email provided
        if (ownerEmail) {
            const owner = await User.findOne({ email: ownerEmail });
            if (!owner) {
                return res.status(404).json({ message: "New owner not found." });
            }
            salon.owner = owner._id;
            salon.ownerEmail = ownerEmail; // ✅ Keep ownerEmail in sync
        }

        const updatedSalon = await salon.save();
        res.json(updatedSalon);
    } catch (err) {
        console.error("Update salon error:", err);
        res.status(500).json({ message: "Server error while updating salon." });
    }
};

// @desc    Delete a salon
// @route   DELETE /api/salons/:id
// @access  Private (owner/admin)
exports.deleteSalon = async (req, res) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: "Salon not found." });
        }

        res.json({ message: "Salon successfully deleted." });
    } catch (err) {
        console.error("Delete salon error:", err);
        res.status(500).json({ message: "Server error while deleting salon." });
    }
};