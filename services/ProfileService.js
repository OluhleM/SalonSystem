const Profile = require('../models/Profile'); //

class ProfileService {
    async createProfile(data) {
        const profile = new Profile(data); //
        return await profile.save();
    }

    async getProfileByUserId(userId) {
        return await Profile.findOne({ userId });
    }

    async updateProfile(userId, data) {
        return await Profile.findOneAndUpdate({ userId }, data, { new: true });
    }

    async deleteProfile(userId) {
        return await Profile.findOneAndDelete({ userId });
    }
}

module.exports = new ProfileService();