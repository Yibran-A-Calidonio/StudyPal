// src/components/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ onStudyTimeUpdate, onStudyComplete }) => {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [localTime, setLocalTime] = useState(0); // Local time for the current session

    useEffect(() => {
        let interval = null;

        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setLocalTime(prevTime => {
                    const newTime = prevTime + 1;
                    onStudyTimeUpdate(1); // Notify parent about the increment
                    return newTime;
                });
            }, 60000); // 1-minute interval
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, onStudyTimeUpdate]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);
        onStudyComplete(); // Reset parent state
        setLocalTime(0); // Reset local time
    };

    return (
        <div>
            <h3>Study Timer</h3>
            <p>Time: {localTime} minutes</p>
            {!isActive && <button onClick={handleStart}>Start Studying</button>}
            {isActive && !isPaused && <button onClick={handlePause}>Pause</button>}
            {isActive && isPaused && <button onClick={handleResume}>Resume</button>}
            {isActive && <button onClick={handleStop}>Stop</button>}
        </div>
    );
};

export default Timer;
