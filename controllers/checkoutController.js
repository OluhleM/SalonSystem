// controllers/checkoutController.js
const Booking = require("../models/Booking");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.checkout = async (req, res) => {
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

        // ===== Process Bookings =====
        for (const b of bookingItems) {
            if (!b.fullPrice || !b.salonId || !b.serviceId || !b.bookingDateTime) {
                console.warn("Skipping invalid booking item:", b);
                continue;
            }

            const booking = new Booking({
                customer: user._id,
                salon: b.salonId,
                service: b.serviceId,
                bookingDateTime: b.bookingDateTime,
                price: b.fullPrice,
                status: "confirmed",
                paymentStatus: "paid",
                notes: "Paid during checkout",
            });

            try {
                const savedBooking = await booking.save();
                createdBookings.push(savedBooking);
            } catch (err) {
                console.error("Failed to save booking:", err.message, b);
            }
        }

        // ===== Process Products =====
        if (productItems.length > 0) {
            const validProducts = productItems.filter(p =>
                p.id && p.price != null && p.quantity != null && p.salonId
            );

            console.log("Valid products:", validProducts); // Log valid products

            if (validProducts.length === 0) {
                console.warn("No valid product items to process.");
            } else {
                const items = [];
                let totalAmount = 0;

                // Process all products concurrently
                await Promise.all(validProducts.map(async p => {
                    try {
                        const product = await Product.findById(p.id);
                        if (!product) {
                            console.warn("Product not found:", p.id);
                            return;
                        }

                        const quantity = p.quantity;
                        const price = p.price;

                        items.push({
                            product: product._id,

                            quantity,
                            price,
                        });

                        totalAmount += price * quantity;

                        // Decrement stock safely
                        product.stock = (product.stock || 0) - quantity;
                        if (product.stock < 0) product.stock = 0;
                        await product.save();
                    } catch (err) {
                        console.error("Error processing product item:", p, err.message);
                    }
                }));

                // Create the order if there are valid items
                if (items.length > 0) {
                    try {
                        console.log("Creating order with salon ID:", validProducts[0].salonId); // Log the salon ID
                        createdOrder = await Order.create({
                            customer: user._id,
                            salon: validProducts[0].salonId, // Use the first valid product's salon
                            items,
                            totalAmount,
                            paymentStatus: "paid",
                            status: "pending",
                        });
                    } catch (err) {
                        console.error("Failed to create order:", err.message, items);
                        return res.status(500).json({ message: "Failed to create product order.", error: err.message });
                    }
                }
            }
        }

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