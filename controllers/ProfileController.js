const profileService = require('../services/profileService');

exports.createProfile = async (req, res) => {
    try {
        const profile = await profileService.createProfile({ ...req.body, userId: req.user.id });
        res.status(201).json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await profileService.updateProfile(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await profileService.deleteProfile(req.user.id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};