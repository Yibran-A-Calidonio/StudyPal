import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';
import './Dashboard.css';

const Dashboard = ({ onLogout, user, connection }) => { // ✅ Receive connection as a prop
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]); // ✅ Move leaderboard state here

    // ✅ Fetch leaderboard once when dashboard loads
    useEffect(() => {
        if (connection) {
            console.log("📡 Fetching initial leaderboard data...");
            connection.invoke("SendRealTimeLeaderboard").catch(err => console.error(err));
        }
    }, [connection]); 

    const handleShowLeaderboard = () => {
        setShowLeaderboard(prev => !prev);

        // ✅ Fetch leaderboard immediately when showing (no need to wait for broadcast)
        if (!showLeaderboard && connection) {
            console.log("📡 Fetching leaderboard on show...");
            connection.invoke("SendRealTimeLeaderboard").catch(err => console.error(err));
        }
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
            {showLeaderboard && <Leaderboard connection={connection} leaderboard={leaderboard} setLeaderboard={setLeaderboard} />}
        </div>
    );
};

export default Dashboard;