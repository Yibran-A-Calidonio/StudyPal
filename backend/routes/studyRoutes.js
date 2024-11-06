const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get or create user study data
router.get('/status', async (req, res) => {
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
    res.json(user);
});

// Update user study time
router.put('/update', async (req, res) => {
    const userID = req.cookies.userID; // Retrieve userID from the cookie
    const { studyTime } = req.body;    // Incremental study time from the request body

    try {
        let user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Increment the user's study time and update the level
        user.studyTime += studyTime;
        user.level = Math.floor(user.studyTime / 60); // Adjust logic if needed

        // Save the updated user data
        await user.save();

        res.json(user); // Return the updated user data to the client
    } catch (error) {
        console.error("Error updating study time:", error);
        res.status(500).json({ message: "Server error while updating study time" });
    }
});
module.exports = router;
