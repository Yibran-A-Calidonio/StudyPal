// Login.js
import React, { useState } from 'react';
import api from '../api'; // Axios instance for making HTTP requests
import './Auth.css'; // Import shared CSS file

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { 
                Email: email, 
                PasswordHash: password 
            });
            onLoginSuccess(response.data); // Pass user data to parent component
            setError('');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };
    

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />
                <button type="submit" className="auth-button">Login</button>
            </form>
            {error && <p className="auth-error">{error}</p>}
        </div>
    );
};

export default Login;
