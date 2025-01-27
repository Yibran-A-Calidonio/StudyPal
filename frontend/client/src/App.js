import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import StudyBuddyApp from './components/StudyBuddyApp';
import Dashboard from './components/Dashboard';
import './App.css'; // Import App-specific CSS

function App() {
    const [user, setUser] = useState(null);

    // Restore user data from localStorage on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse and set the stored user
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData); // Set user state
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
    };

    const handleLogout = () => {
        setUser(null); // Clear user state
        localStorage.removeItem('user'); // Remove user data from localStorage
    };

    return (
        <div className="App">
            <h1 className="app-title">Study Pal</h1>
            {!user ? (
                <div className="auth-page">
                    <Login onLoginSuccess={handleLoginSuccess} />
                    <Registration />
                </div>
            ) : (
                <div>
                    <Dashboard user={user} onLogout={handleLogout} />
                    <StudyBuddyApp user={user} />
                </div>
            )}
        </div>
    );
}

export default App;