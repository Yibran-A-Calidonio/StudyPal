const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get or create user study data
router.get('/status', async (req, res) => {
    try {
        let user = await User.findOne({ userID: req.userID });
        if (!user) {
            user = new User({
                userID: req.userID,
                name: req.query.name || "Guest",
                studyTime: 0,
                level: 1,
                createdAt: new Date()
            });
            await user.save();
        }
        // Calculate level but don't save it here in the GET request
        user.level = Math.floor(user.studyTime / 60) + 1; // Just for display purposes
        res.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Server error" });
    }
});



router.put('/update', async (req, res) => {
    const userID = req.cookies.userID;
    const { studyTime } = req.body; // This should be the increment (e.g., 1 minute)

    try {
        let user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the incoming increment to the existing studyTime
        user.studyTime += studyTime;
        user.level = Math.floor(user.studyTime / 60) + 1; // Recalculate level

        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Error updating study time:", error);
        res.status(500).json({ message: "Server error while updating study time" });
    }
});


module.exports = router;
