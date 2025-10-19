const express = require("express");
const Booking = require("../models/Booking");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/orders/checkout
 * Processes all cart items (products + bookings)
 */
router.post("/checkout", protect, async (req, res) => {
    try {
        const { cart } = req.body;
        const user = req.user;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        const bookingItems = cart.filter(item => item.type === "booking");
        const productItems = cart.filter(item => item.type === "product");

        const createdBookings = [];
        let createdOrder = null;

        // Process bookings
        for (const b of bookingItems) {
            if (!b.fullPrice || !b.salonId || !b.serviceId || !b.bookingDateTime) {
                return res.status(400).json({ message: "Invalid booking item." });
            }

            const booking = new Booking({
                customer: user._id,
                salon: b.salonId,
                service: b.serviceId,
                bookingDateTime: b.bookingDateTime,
                price: b.fullPrice, // make sure your frontend cart has this
                status: "confirmed",
                paymentStatus: "paid",
                notes: "Paid during checkout",
            });
            const savedBooking = await booking.save();
            createdBookings.push(savedBooking);
        }

        // Process products as a single order
        if (productItems.length > 0) {
            const items = [];
            let totalAmount = 0;

            for (const p of productItems) {
                const product = await Product.findById(p.id);
                if (!product) {
                    console.warn("Skipping missing product:", p.id);
                    continue;
                }

                const quantity = p.quantity || 1;
                const price = product.price ?? p.price ?? 0;

                if (price <= 0) {
                    console.warn("Product price invalid, skipping:", product._id);
                    continue;
                }

                items.push({
                    product: product._id,
                    quantity,
                    price,
                });

                totalAmount += price * quantity;

                // Decrement stock
                product.stock = Math.max(0, product.stock - quantity);
                await product.save();
            }


            if (items.length > 0) {
                createdOrder = await Order.create({
                    customer: user._id,
                    salon: productItems[0].salonId, // assumes all products from same salon
                    items,
                    totalAmount,
                    paymentStatus: "paid",
                    status: "pending",
                });
            }
        }

        res.status(201).json({
            message: "Checkout completed successfully.",
            bookings: createdBookings,
            order: createdOrder,
        });
    } catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({ message: "Internal server error during checkout.", error: err.message });
    }
});

module.exports = router;


