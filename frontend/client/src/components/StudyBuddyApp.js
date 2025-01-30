import React, { useState, useEffect } from 'react';
import api from '../api'; // Axios instance for HTTP requests
import level1Image from '../assets/study-buddy/level1.png';
import level2Image from '../assets/study-buddy/level2.png';
import level3Image from '../assets/study-buddy/level3.png';
import level4Image from '../assets/study-buddy/level4.png';
import level5Image from '../assets/study-buddy/level5.png';
import level6Image from '../assets/study-buddy/level6.png';

const StudyBuddyApp = ({ user }) => {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [studyTime, setStudyTime] = useState(0); // Current session time in seconds
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused && sessionStartTime) {
            interval = setInterval(() => {
                setStudyTime(Math.floor((Date.now() - sessionStartTime) / 100)); 
            }, 100); // Update every second
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused, sessionStartTime]);
    

    // Log study time every minute
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(async () => {
                try {
                    await api.post('/studybuddy/log-session', {
                        userId: user.id,
                        durationMinutes: 1, // Log 1 minute increment
                        sessionDate: new Date().toISOString(), // Current timestamp
                    });
                } catch (error) {
                    console.error('Error logging study time:', error);
                }
            }, 6000); // Log every 6 seconds
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, user]);

    // Handle Start Studying
    const handleStart = async () => {
        setIsActive(true);
        setIsPaused(false);
        try {
            await api.post(`/studybuddy/start-session/${user.id}`);
        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    // Handle Stop Studying
    const handleStop = async () => {
        setIsActive(false);
        setIsPaused(false);

        if (studyTime > 0) {
            try {
                await api.post('/studybuddy/log-session', {
                    userId: user.id,
                    durationMinutes: Math.floor(studyTime / 60), // Convert seconds to minutes
                    sessionDate: new Date().toISOString(),
                });

                await api.post(`/studybuddy/end-session/${user.id}`);
            } catch (error) {
                console.error('Error stopping session:', error);
            }
        }

        setStudyTime(0); // Reset study time
    };

    const handlePause = async () => {
        setIsPaused(true);
        try {
            await api.post(`/studybuddy/pause-session/${user.id}`);
        } catch (error) {
            console.error('Error pausing session:', error);
        }
    };

    // Handle Resume
    const handleResume = async () => {
        setIsPaused(false);
        try {
            // ✅ Send request to start session again (it will use previously logged time)
            await api.post(`/studybuddy/start-session/${user.id}`);
        } catch (error) {
            console.error('Error resuming session:', error);
        }
    };
    

    // Calculate minutes and seconds for display
    const minutes = Math.floor(studyTime / 60);
    const seconds = studyTime % 60;

    const level = Math.floor(studyTime / 3600) + 1; // 1 level per hour of study
    const levelProgress = (studyTime % 3600) / 3600; // Progress toward the next level (0 to 1)

    // Map level to the corresponding image
    const levelImages = {
        1: level1Image,
        2: level2Image,
        3: level3Image,
        4: level4Image,
        5: level5Image,
        6: level6Image,
    };
    const buddyImage = levelImages[level] || levelImages[Object.keys(levelImages).length];

    return (
        <div>
            <h1>Study Buddy</h1>
            
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', marginBottom: '20px' }}>
                <div
                    style={{
                        width: `${levelProgress * 100}%`,
                        height: '100%',
                        backgroundColor: 'green',
                        transition: 'width 0.5s ease',
                    }}
                ></div>
            </div>

            <h2>Level: {level}</h2>
            <div>
                <img
                    src={buddyImage}
                    alt={`Study Buddy Level ${level}`}
                    style={{ width: '200px', height: 'auto', marginTop: '20px' }}
                />
            </div>
            <p>Current Session Time: {minutes} minutes and {seconds} seconds</p>
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