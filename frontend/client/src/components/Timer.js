import React, { useState, useEffect } from 'react';

const Timer = ({ initialStudyTime, onStudyTimeUpdate, onStudyComplete }) => {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentSessionTime, setCurrentSessionTime] = useState(0); // Time for the current session

    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setCurrentSessionTime(prevTime => {
                    const newTime = prevTime + 1;
                    onStudyTimeUpdate(1); // Notify parent about each minute increment
                    return newTime;
                });
            }, 6000); // 1-minute interval
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, onStudyTimeUpdate]);

    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);
        if (currentSessionTime > 0) {
            onStudyComplete(currentSessionTime); // Send only the current session time to the parent
        }
        setCurrentSessionTime(0); // Reset for the next session
    };

    return (
        <div>
            <h3>Study Timer</h3>
            <p>Current Session Time: {currentSessionTime} minutes</p>
            {!isActive && <button onClick={() => setIsActive(true)}>Start Studying</button>}
            {isActive && !isPaused && <button onClick={() => setIsPaused(true)}>Pause</button>}
            {isActive && isPaused && <button onClick={() => setIsPaused(false)}>Resume</button>}
            {isActive && <button onClick={handleStop}>Stop</button>}
        </div>
    );
};

export default Timer;
