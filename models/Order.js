const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true
        },
        // Multiple product items per order
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        // Payment and order lifecycle similar to booking
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid"
        },
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "cancelled"],
            default: "pending"
        },
        notes: {
            type: String
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

