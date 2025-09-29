const Service = require("../models/Service");

// Create service
exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().populate("salon", "name");
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single service
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate("salon", "name");
        if (!service) return res.status(404).json({ error: "Service not found" });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ error: "Service not found" });
        res.json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ error: "Service not found" });
        res.json({ message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
