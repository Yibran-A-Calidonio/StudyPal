import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState('');
    const connectionRef = useRef(null); // Use ref to persist connection across renders

    useEffect(() => {
        if (connectionRef.current) return; // ✅ Prevent multiple connections

        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5251/leaderboardHub', {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000]) // ✅ Reconnect after 2s, 5s, and 10s if needed
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        connection.on('ReceiveLeaderboard', (data) => {
            console.log("📩 Received Leaderboard Data:", data);
            if (data && Array.isArray(data)) {
                setLeaderboard(data);
            } else {
                console.log("⚠️ Empty or invalid leaderboard data received.");
            }
        });

        connection.start()
            .then(() => {
                console.log("✅ Connected to SignalR Hub");
            })
            .catch((err) => {
                console.error('❌ Error connecting to SignalR:', err);
                setError('Failed to connect to real-time updates.');
            });

        return () => {
            if (connectionRef.current) {
                console.log("🛑 Stopping SignalR connection...");
                connectionRef.current.stop();
                connectionRef.current = null;
            }
        };
    }, []); // ✅ Empty dependency array ensures effect runs once

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
            {!error && leaderboard.length === 0 && <p>No active study sessions.</p>}
        </div>
    );
};

export default Leaderboard;
