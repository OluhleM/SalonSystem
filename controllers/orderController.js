const Booking = require("../models/Booking");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.checkout = async (req, res) => {
    try {
        const user = req.user; // Populated by auth middleware
        const { cart } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        // Separate cart items by type
        const bookingItems = cart.filter(item => item.type === "booking");
        const productItems = cart.filter(item => item.type === "product");

        const createdBookings = [];
        let createdOrder = null;

        // ============================
        // 1️⃣ Process Bookings
        // ============================
        for (const item of bookingItems) {
            if (!item.fullPrice || !item.salonId || !item.serviceId || !item.bookingDateTime) {
                console.warn("Skipping invalid booking item:", item);
                continue;
            }

            const booking = new Booking({
                customer: user._id,
                salon: item.salonId,
                service: item.serviceId,
                bookingDateTime: item.bookingDateTime,
                price: item.fullPrice,
                paymentStatus: "paid",
                status: "confirmed",
                notes: "Paid during checkout",
            });

            try {
                const savedBooking = await booking.save();
                createdBookings.push(savedBooking);
            } catch (err) {
                console.error("Failed to save booking:", err.message, item);
            }
        }

        // ============================
        // 2️⃣ Process Product Orders
        // ============================
        if (productItems.length > 0) {
            const validProducts = [];

            // Validate and fetch each product
            for (const item of productItems) {
                if (!item.id || !item.price || !item.quantity || !item.salonId) {
                    console.warn("Skipping invalid product item:", item);
                    continue;
                }

                const product = await Product.findById(item.id);
                if (!product) {
                    console.warn("Product not found in DB:", item.id);
                    continue;
                }

                // Decrement stock safely
                const newStock = Math.max(0, product.stock - item.quantity);
                product.stock = newStock;
                await product.save();

                validProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: item.price,
                });
            }

            if (validProducts.length > 0) {
                const totalAmount = validProducts.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                createdOrder = new Order({
                    customer: user._id,
                    salon: productItems[0].salonId,
                    items: validProducts,
                    totalAmount,
                    paymentStatus: "paid",
                    status: "pending",
                    notes: "Paid during checkout",
                });

                await createdOrder.save();
            }
        }

        // ============================
        // ✅ Response
        // ============================
        return res.status(201).json({
            message: "Checkout completed successfully.",
            bookings: createdBookings,
            order: createdOrder,
        });

    } catch (err) {
        console.error("Checkout error:", err);
        return res.status(500).json({
            message: "Internal server error during checkout.",
            error: err.message,
        });
    }
};

