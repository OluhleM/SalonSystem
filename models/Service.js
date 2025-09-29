const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
            name: { type: String, required: true },  // e.g., Haircut
            description: { type: String },
            duration: { type: Number, required: true }, // in minutes
            price: { type: Number, required: true },
            salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true }, // Which salon offers it
            category: { type: String }, // e.g., Hair, Nails, Spa
            isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);

