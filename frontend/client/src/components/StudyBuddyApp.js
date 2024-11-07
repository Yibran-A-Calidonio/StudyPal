import React, { useState, useEffect } from 'react';
import api from '../api'; // Axios instance for making HTTP requests
import level1Image from '../assets/study-buddy/level1.png';
import level2Image from '../assets/study-buddy/level2.png';
import level3Image from '../assets/study-buddy/level3.png';
import level4Image from '../assets/study-buddy/level4.png';
import level5Image from '../assets/study-buddy/level5.png';
import level6Image from '../assets/study-buddy/level6.png';
// Add more level images as needed

const StudyBuddyApp = () => {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [studyTime, setStudyTime] = useState(0);
    const [currentSessionTime, setCurrentSessionTime] = useState(0);

    // Fetch initial study time from the backend when the component mounts
    useEffect(() => {
        const fetchInitialStudyTime = async () => {
            try {
                const response = await api.get('/status');
                setStudyTime(response.data.studyTime || 0); // Set initial study time from the backend
            } catch (error) {
                console.error('Error fetching initial study time from backend:', error);
            }
        };
        fetchInitialStudyTime();
    }, []);

    // Ensure you're sending only the current session time when updating the backend
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(async () => {
                try {
                    await api.put('/update', { studyTime: 1 }); // Send 1 minute increment
                } catch (error) {
                    console.error('Error syncing study time with backend:', error);
                }
    
                setCurrentSessionTime(prevTime => {
                    const newTime = prevTime + 1;
                    setStudyTime(total => total + 1); // Increment local study time
                    return newTime;
                });
            }, 60000); // 1-minute interval
        } else {
            clearInterval(interval);
        }
    
        return () => clearInterval(interval);
    }, [isActive, isPaused]);
    
    
    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);
    
        // Don't send any additional requests to the backend when stopping; just reset the session time
        setCurrentSessionTime(0); // Reset current session time for next session
    };
    
    
    
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


    const level = Math.floor(studyTime / 60) + 1; // Calculate level based on total study time

    // Map level to the corresponding image
    const levelImages = {
        1: level1Image,
        2: level2Image,
        3: level3Image,
        4: level4Image,
        5: level5Image,
        6: level6Image,
        // Add more levels as needed
    };
    const buddyImage = levelImages[level] || levelImages[Object.keys(levelImages).length];

    const progressPercentage = (studyTime % 60) / 60 * 100;

    return (
        <div>
            <h1>Study Buddy</h1>
            <h2>Level: {level}</h2>
            <div style={{ width: '100%', height: '30px', backgroundColor: '#e0e0e0' }}>
                <div
                    style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: 'green',
                        transition: 'width 0.5s ease',
                    }}
                ></div>
            </div>
            <img
                src={buddyImage}
                alt={`Study Buddy Level ${level}`}
                style={{ width: '200px', height: 'auto', marginTop: '20px' }}
            />
            <p>Current Session Time: {currentSessionTime} minutes</p>
            <div>
                {!isActive && <button onClick={handleStart}>Start Studying</button>}
                {isActive && !isPaused && <button onClick={handlePause}>Pause</button>}
                {isActive && isPaused && <button onClick={handleResume}>Resume</button>}
                {isActive && <button onClick={handleStop}>Stop</button>}
            </div>
        </div>
    );
};

export default StudyBuddyApp;
