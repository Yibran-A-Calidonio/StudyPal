import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import Login from './components/Login';
import Registration from './components/Registration';
import StudyBuddyApp from './components/StudyBuddyApp';
import Dashboard from './components/Dashboard';
import AnalyticsPanel from './components/AnalyticsPanel';
import GraphPanel from "./components/GraphPanel";
import GoalsList from './components/GoalsList';
import Flashcards from './components/Flashcards';
import api from './api';
import './App.css'; // Import App-specific CSS


function App() {
    const [user, setUser] = useState(null);
    const [connection, setConnection] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Restore user data from localStorage on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleToggleAnalytics = () => {
        setShowAnalytics(prev => !prev);
    };

    // ✅ Initialize WebSocket connection only ONCE
    useEffect(() => {
        if (connection) return; // ✅ Prevent re-creating connection

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5251/leaderboardHub', {
                skipNegotiation: true, // ✅ Use WebSockets directly
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        newConnection.start()
            .then(() => {
                console.log("✅ Connected to SignalR Hub");
                setConnection(newConnection);
            })
            .catch((err) => {
                console.error('❌ Error connecting to SignalR:', err);
            });

        // ✅ Do NOT stop connection in cleanup function
        return () => {
            if (newConnection.state === signalR.HubConnectionState.Connected) {
                console.log("🛑 Stopping SignalR connection...");
                newConnection.stop();
            }
        };
    }, []); // ✅ Empty dependency array ensures it runs only ONCE

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = async () => {
        if (user) {
            try {
                await api.post(`/studybuddy/end-session/${user.id}`); // ✅ Use end-session instead of creating a new one
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    
        setUser(null);
        localStorage.removeItem('user');
    
        if (connection) {
            console.log("🛑 Stopping SignalR connection...");
            connection.stop();
        }
    };
    const sampleCards = [
        { question: "What is 2 + 2?", answer: "4" },
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "What does CPU stand for?", answer: "Central Processing Unit" },
      ];
    return (
        <div className="Background">
            {user && (
                <button className="analytics-btn" onClick={handleToggleAnalytics}>
                    {!showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </button>
            )}
            <div className="AnalyticsContainer">
                <GoalsList user={user} />
                <Flashcards cards={sampleCards} />
            </div>
            <div className="App">
                <h1 className="app-title">Study Pal</h1>
                {!user ? (
                    <div className="auth-page">
                        <Login onLoginSuccess={handleLoginSuccess} />
                        <Registration />
                    </div>
                ) : (
                    <div>
                        <Dashboard user={user} onLogout={handleLogout} connection={connection} /> 
                        <StudyBuddyApp user={user} />
                    </div>
                )}
            </div>
            <div>
            {!showAnalytics && (
                <div className="AnalyticsContainer">
                    <AnalyticsPanel user={user} onClose={handleToggleAnalytics} />
                    <GraphPanel user={user} />
                </div>
            )}
            </div>
        </div>
    );
}

export default App;