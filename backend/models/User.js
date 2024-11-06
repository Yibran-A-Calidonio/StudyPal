const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    name: { type: String, default: "Guest" },
    studyTime: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    createdAt: { type: Date, expires: '24h', default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
