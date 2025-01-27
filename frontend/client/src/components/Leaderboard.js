import React, { useState, useEffect } from 'react';
import api from '../api';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/studybuddy/leaderboard');
                setLeaderboard(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load leaderboard. Please try again later.');
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            {error && <p className="error-message">{error}</p>}
            {!error && (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Display Name</th>
                            <th>Total Study Time (minutes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user.Id}>
                                <td>{index + 1}</td>
                                <td>{user.DisplayName}</td>
                                <td>{user.TotalStudyTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;
