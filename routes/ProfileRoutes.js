const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// CRUD routes
router.post('/', protect, profileController.createProfile);
router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.delete('/', protect, profileController.deleteProfile);

module.exports = router;