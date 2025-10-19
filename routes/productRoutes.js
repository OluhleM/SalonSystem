const express = require("express");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/products?salon=SALON_ID
router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", protect, authorizeRoles("owner", "admin"), createProduct);
router.put("/:id", protect, authorizeRoles("owner", "admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("owner", "admin"), deleteProduct);

module.exports = router;






// const express = require('express');
// const router = express.Router();
//
// router.get('/', (req, res) => {
//   res.send('Products route working!');
// });
//
// module.exports = router;
