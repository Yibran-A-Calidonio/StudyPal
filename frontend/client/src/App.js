import React, { useState, useEffect } from 'react';
import api from './api'; // Axios instance
import StudyBuddyApp from './components/StudyBuddyApp'; // Import the combined component

function App() {
    const [initialStudyTime, setInitialStudyTime] = useState(0);

    // Fetch initial study time from the backend on load
    useEffect(() => {
        const fetchStudyBuddy = async () => {
            try {
                const response = await api.get('/status');
                setInitialStudyTime(response.data.studyTime || 0); // Set initial study time from the backend
            } catch (error) {
                console.error("Error fetching study buddy data:", error);
            }
        };
        fetchStudyBuddy();
    }, []);

    return (
        <div className="App">
            {/* Pass the initial study time as a prop to the combined component */}
            <StudyBuddyApp initialStudyTime={initialStudyTime} />
        </div>
    );
}

export default App;
