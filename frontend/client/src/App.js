import React, { useState, useEffect } from 'react';
import api from './api'; // Axios instance
import StudyBuddy from './components/StudyBuddy';
import Timer from './components/Timer';

function App() {
    const [studyBuddy, setStudyBuddy] = useState({ studyTime: 0, level: 1 });

    // Fetch user data on initial load
    useEffect(() => {
        const fetchStudyBuddy = async () => {
            try {
                const response = await api.get('/status');
                setStudyBuddy(response.data);
            } catch (error) {
                console.error("Error fetching study buddy data:", error);
            }
        };
        fetchStudyBuddy();
    }, []);

    // Function to handle study time updates from Timer component
    const handleStudyTimeUpdate = (increment) => {
        setStudyBuddy(prevState => {
            const updatedTime = prevState.studyTime + increment;
            return {
                ...prevState,
                studyTime: updatedTime,
                level: Math.floor(updatedTime / 60) + 1 // Update level logic
            };
        });
    };

    // Function to handle completed study session and sync with backend
    const handleStudyComplete = async (sessionTime) => {
        try {
            const response = await api.put('/update', { studyTime: sessionTime });
            setStudyBuddy(response.data);
        } catch (error) {
            console.error("Error updating study time:", error);
        }
    };

    return (
        <div className="App">
            <h1>Study Buddy</h1>
            <StudyBuddy studyTime={studyBuddy.studyTime} level={studyBuddy.level} />
            <Timer onStudyComplete={handleStudyComplete} onStudyTimeUpdate={handleStudyTimeUpdate} />
        </div>
    );
}

export default App;