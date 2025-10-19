const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {checkout} = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", protect, checkout);

module.exports = router;