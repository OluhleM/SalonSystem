const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
        bookingDateTime: { type: Date, required: true },
        phone: { type: String },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid",
        },
        notes: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);


