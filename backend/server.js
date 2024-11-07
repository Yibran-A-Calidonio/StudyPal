require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

// Connect to database
connectDB();

// CORS configuration with credentials allowed
app.use(cors({
    origin: 'https://yourwebstuddybuddy-frontend.onrender.com', // Specify your frontend URL
    credentials: true, // Allow cookies to be sent
}));

// Handle preflight `OPTIONS` requests for all routes
app.options('*', cors({
    origin: 'https://yourwebstuddybuddy-frontend.onrender.com',
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Generate user ID if not present
app.use((req, res, next) => {
    if (!req.cookies.userID) {
        const newUserID = uuidv4();
        res.cookie('userID', newUserID, { maxAge: 24 * 60 * 60 * 1000 }); // 24-hour expiry
        req.userID = newUserID;
    } else {
        req.userID = req.cookies.userID;
    }
    next();
});

// Routes
app.use('/api/study', require('./routes/studyRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
