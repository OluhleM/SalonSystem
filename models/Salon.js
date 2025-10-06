// models/Salon.js
const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerEmail: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },
    openingHours: {
        start: { type: String }, // e.g., "09:00"
        end: { type: String }    // e.g., "18:00"
    },

    imageURL: String
    // Optional: Add these later for richer frontend
    // rating: { type: Number, default: 4.5 },
    // categories: [{ type: String }] // e.g., ["Hair", "Nails"]

}, {
    timestamps: true
});

module.exports = mongoose.model('Salon', salonSchema);