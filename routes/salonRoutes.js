const express = require("express");
const {
    registerSalon,
    getSalons,
    getSalonById,
    updateSalon,
    deleteSalon,
} = require("../controllers/salonController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/salons
 * @desc    Get all salons (public)
 */
router.get("/", getSalons);

/**
 * @route   GET /api/salons/:id
 * @desc    Get a salon by ID (public)
 */
router.get("/:id", getSalonById);

/**
 * @route   POST /api/salons
 * @desc    Register a new salon (protected)
 */
router.post(
    "/",
    protect,
    authorizeRoles("owner", "admin"),
    registerSalon
);

/**
 * @route   PUT /api/salons/:id
 * @desc    Update a salon by ID (protected)
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("owner", "admin"),
    updateSalon
);

/**
 * @route   DELETE /api/salons/:id
 * @desc    Delete a salon by ID (protected)
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("owner", "admin"),
    deleteSalon
);

module.exports = router;