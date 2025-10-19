const express = require("express");
const { getServices, getServiceById, createService, updateService, deleteService } = require("../controllers/serviceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/services?salon=SALON_ID
router.get("/", getServices);

router.get("/:id", getServiceById);
router.post("/", protect, authorizeRoles("owner", "admin"), createService);
router.put("/:id", protect, authorizeRoles("owner", "admin"), updateService);
router.delete("/:id", protect, authorizeRoles("owner", "admin"), deleteService);

module.exports = router;


