import React, { useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ connection, leaderboard, setLeaderboard }) => {
    useEffect(() => {
        if (!connection) return; // ✅ Wait until connection is ready

        connection.on('ReceiveLeaderboard', (data) => {
            console.log("📩 Received Leaderboard Data:", data);
            setLeaderboard(data); // ✅ Update the state in Dashboard.js
        });

        return () => {
            connection.off('ReceiveLeaderboard'); // ✅ Prevent duplicate listeners
        };
    }, [connection, setLeaderboard]);

    return (
        <div className="leaderboard-container">
            <h2>Current Study Leaderboard</h2>
            {leaderboard.length > 0 ? (
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
            ) : (
                <p>No active study sessions.</p>
            )}
        </div>
    );
};

export default Leaderboard;
