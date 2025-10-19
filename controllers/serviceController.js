const Service = require("../models/Service");

// Create a new service
exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all services, optionally filter by salon
exports.getServices = async (req, res) => {
    try {
        const query = {};
        if (req.query.salon) {
            query.salon = req.query.salon; // only services for this salon
        }

        const services = await Service.find(query).populate("salon", "name address");
        res.status(200).json(services);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate("salon", "name address");
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json(service);
    } catch (err) {
        console.error("Error fetching service:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update service by ID
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete service by ID
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

