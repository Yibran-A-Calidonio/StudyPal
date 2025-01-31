import React, { useEffect, useState } from 'react';
import api from '../api';
import './AnalyticsPanel.css';

const AnalyticsPanel = ({ user, onClose }) => {
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchStudyStats = async () => {
            try {
                const response = await api.get(`/studybuddy/user-study-stats/${user.id}`);
                setTotalStudyTime(response.data.totalStudyTime);
                setStreak(response.data.streak);
            } catch (error) {
                console.error("Error fetching study stats:", error);
            }
        };

        fetchStudyStats();
    }, [user]);

    return (
        <div className="Analytics">
            <h2>📊 Study Analytics</h2>

            <div className="analytics-item">
                <h3>⏳ Total Study Time</h3>
                <p>{totalStudyTime} minutes</p>
            </div>

            <div className="analytics-item">
                <h3>🔥 Streaks</h3>
                <p>{streak} days</p>
            </div>

            <button className="close-btn" onClick={onClose}>Close</button>
        </div>
    );
};

export default AnalyticsPanel;