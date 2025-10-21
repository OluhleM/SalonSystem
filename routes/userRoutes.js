const express = require("express");
const {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);
router.put("/:id/password", protect, updatePassword);


module.exports = router;



