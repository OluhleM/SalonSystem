const express = require('express');
const router = express.Router();

// Placeholder appointment routes
router.get('/', (req, res) => {
	res.json({ message: 'Appointments route working' });
});

router.post('/', (req, res) => {
	res.status(201).json({ message: 'Create appointment (not implemented)' });
});

module.exports = router;

