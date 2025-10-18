const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        role: {
            type: String,
            enum: ["customer", "owner", "admin"],
            default: "customer",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

