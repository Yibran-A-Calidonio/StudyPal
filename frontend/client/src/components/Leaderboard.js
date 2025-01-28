import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import api from '../api';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load initial leaderboard data via API
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/studybuddy/leaderboard');
                console.log("PPOOOPOPOPOPOPOLL");
                setLeaderboard(response.data);
                console.log(leaderboard);
            } catch (err) {
                console.error(err);
                setError('Failed to load leaderboard. Please try again later.');
            }
        };

        fetchLeaderboard();

        // Set up SignalR connection for real-time updates
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5251/leaderboardHub') // Update with backend URL
            .build();

        connection.on('ReceiveLeaderboard', (data) => {
            setLeaderboard(data); // Update leaderboard with real-time data
        });
        
        connection
            .start()
            .catch((err) => {
                console.error('Error connecting to SignalR:', err);
                setError('Failed to connect to real-time updates.');
            });

        // Clean up SignalR connection
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div className="leaderboard-container">
            <h2>Current Study Leaderboard</h2>
            {error && <p className="error-message">{error}</p>}
            {!error && (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User ID</th>
                            <th>Current Study Time (minutes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user.userId}>
                                <td>{index + 1}</td>
                                <td>{user.userId}</td>
                                <td>{Math.floor(user.elapsedMinutes || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;
