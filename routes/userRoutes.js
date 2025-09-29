const express = require("express");
const {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Register new user
router.post("/register", registerUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;

