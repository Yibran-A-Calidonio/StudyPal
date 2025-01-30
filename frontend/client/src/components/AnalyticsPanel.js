import React from 'react';
import './AnalyticsPanel.css';

const AnalyticsPanel = ({ user, onClose }) => {
    return (
        <div className="Analytics">
            <h2>📊 Study Analytics</h2>

            {/* Placeholder for total study time */}
            <div className="analytics-item">
                <h3>⏳ Total Study Time</h3>
                <p>Loading...</p>
            </div>

            {/* Placeholder for streaks */}
            <div className="analytics-item">
                <h3>🔥 Streaks</h3>
                <p>Loading...</p>
            </div>

            {/* Placeholder for study goals */}
            <div className="analytics-item">
                <h3>🎯 Study Goals</h3>
                <p>Loading...</p>
            </div>

            {/* Close button */}
            <button className="close-btn" onClick={onClose}>Close</button>
        </div>
    );
};

export default AnalyticsPanel;