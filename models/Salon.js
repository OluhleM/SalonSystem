const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String },
        address: { type: String, required: true },
        phone: { type: String },
        email: { type: String },
        openingHours: {
            start: { type: String }, // e.g. "09:00"
            end: { type: String },   // e.g. "18:00"
        },
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Salon", salonSchema);
