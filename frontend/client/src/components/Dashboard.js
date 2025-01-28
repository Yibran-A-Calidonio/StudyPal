import React, { useState } from 'react';
import Leaderboard from './Leaderboard';
import './Dashboard.css';

const Dashboard = ({ onLogout, user }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const handleShowLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    return (
        <div className="dashboard">
            <h2>Welcome, {user.displayName || user.email || 'User'}!</h2>
            <div className="dashboard-actions">
                <button onClick={handleShowLeaderboard} className="dashboard-button">
                    {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
                </button>
                <button onClick={onLogout} className="dashboard-button logout-button">
                    Logout
                </button>
            </div>
            {showLeaderboard && <Leaderboard />}
        </div>
    );
};

export default Dashboard;
