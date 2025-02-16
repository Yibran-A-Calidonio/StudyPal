import React, { useState, useEffect } from 'react';
import './StudyBuddyApp.css';
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
    const [quotes, setQuotes] = useState([]); // Store quotes
    const [currentQuote, setCurrentQuote] = useState(null); // Store current quote
    const [showQuote, setShowQuote] = useState(false); // Toggle quote visibility
    

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setStudyTime((prevTime) => prevTime + 1);
            }, 100); // Run every milli second
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    // Fetch quotes on component mount
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await api.get('/studybuddy/random-quotes/100'); // Get 100 random quotes
                setQuotes(response.data); // Store quotes in state
            } catch (error) {
                console.error("Error fetching quotes:", error);
            }
        };

        fetchQuotes();
    }, []);

    // Get a random quote
    const getRandomQuote = () => {
        if (quotes.length === 0) return null;
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    const handleBuddyClick = () => {
        setShowQuote(false); // Reset animation
        setTimeout(() => {
            setCurrentQuote(getRandomQuote());
            setShowQuote(true);
        }, 50); // Short delay to restart animation
    };
    

    // Log study time every minute
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(async () => {
                try {
                    await api.post('/studybuddy/log-session', {
                        userId: user.id,
                        durationMinutes: 1, // Log 1 minute increment
                        sessionDate: new Date().toISOString(),
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

    useEffect(() => {
        const syncStudyTimeOnReturn = async () => {
            if (!user?.id) return;

            try {
                const response = await api.get(`/studybuddy/get-study-time/${user.id}`);
                if (response.data.elapsedMinutes !== undefined) {
                    setStudyTime(Math.floor(response.data.elapsedMinutes * 60));
                }
            } catch (error) {
                console.error("Error syncing study time:", error);
            }
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log("🔄 User returned to page, syncing study time...");
                syncStudyTimeOnReturn();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [user]);

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
                    durationMinutes: Math.floor(studyTime / 60),
                    sessionDate: new Date().toISOString(),
                });

                await api.post(`/studybuddy/end-session/${user.id}`);
            } catch (error) {
                console.error('Error stopping session:', error);
            }
        }

        setStudyTime(0);
    };

    const handlePause = async () => {
        setIsPaused(true);
        try {
            await api.post(`/studybuddy/pause-session/${user.id}`);
        } catch (error) {
            console.error('Error pausing session:', error);
        }
    };

    const handleResume = async () => {
        setIsPaused(false);
        try {
            await api.post(`/studybuddy/start-session/${user.id}`);
        } catch (error) {
            console.error('Error resuming session:', error);
        }
    };

    // Calculate minutes and seconds for display
    const minutes = Math.floor(studyTime / 60);
    const seconds = studyTime % 60;

    const level = Math.floor(studyTime / 3600) + 1;
    const levelProgress = (studyTime % 3600) / 3600;

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
            <h1>Study Pal</h1>

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

            <div onClick={handleBuddyClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
                <img
                    src={buddyImage}
                    alt={`Study Buddy Level ${level}`}
                    style={{ width: '200px', height: 'auto', marginTop: '20px' }}
                />
            </div>

            {/* Quote Display (Only visible when user clicks Study Buddy) */}
            {showQuote && currentQuote && (
                <div className={`quote-box ${showQuote ? '' : 'hidden'}`}>
                    <h3>💡 Study Motivation</h3>
                    <p>{currentQuote.quoteText}</p>
                </div>
            )}

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
