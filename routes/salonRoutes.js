const express = require("express");
const {
    registerSalon,
    getSalons,
    getSalonById,
    updateSalon,
    deleteSalon,
} = require("../controllers/salonController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


/**
 * @route   GET /api/salons
 * @desc    Get all salons (public)
 */

/**
 * @route   GET /api/salons/:id
 * @desc    Get a salon by ID (public)
 */
router.get("/", getSalons); // public
router.get(
    "/:id",
    protect,
    authorizeRoles("owner", "admin"),   // Only owners & admins
    getSalonById
);

/**
 * @route   POST /api/salons
 * @desc    Register a new salon (protected)
 */
router.post(
    "/",
    protect,
    authorizeRoles("owner", "admin"),   // Only owners & admins
    registerSalon
);

/**
 * @route   PUT /api/salons/:id
 * @desc    Update a salon by ID (protected)
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("owner", "admin"),   // Only owners & admins
    updateSalon
);

/**
 * @route   DELETE /api/salons/:id
 * @desc    Delete a salon by ID (protected)
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("owner", "admin"),   // Only owners & admins
    deleteSalon
);


module.exports = router;


