const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, phone, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "First name, Last name, email, and password are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// @desc    Login user and get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            _id: user._id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Optional: add authorization logic here later (req.user.id check)
        const { firstName, middleName, lastName, email, phone, password } = req.body;

        user.firstName = firstName || user.firstName;
        user.middleName = middleName || user.middleName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user password (separate route)
// @route   PUT /api/users/:id/password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

