const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);