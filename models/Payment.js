const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }, // optional
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // optional
        amount: { type: Number, required: true },
        method: { type: String, enum: ["card", "paypal", "payfast"], required: true },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },
        transactionId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
