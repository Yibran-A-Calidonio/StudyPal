import React, { useState, useEffect } from 'react';
import api from '../api'; // Axios instance for making HTTP requests
import './Dashboard.css'; // Dashboard-specific styles

const Dashboard = ({ onLogout, user }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/studybuddy/leaderboard'); // Adjust URL as needed
            setLeaderboard(response.data);
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
            setError('Failed to fetch leaderboard. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Toggle leaderboard visibility and fetch data if needed
    const handleShowLeaderboard = () => {
        if (!showLeaderboard) {
            fetchLeaderboard();
        }
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
            {loading && <p>Loading leaderboard...</p>}
            {error && <p className="dashboard-error">{error}</p>}
            {showLeaderboard && !loading && !error && (
                <div className="leaderboard">
                    <h3>Leaderboard</h3>
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Total Time (minutes)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.displayName || `User ${user.id}`}</td>
                                    <td>{Math.floor(user.totalTime / 60)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
