// Registration.js
import React, { useState } from 'react';
import api from '../api'; // Axios instance for making HTTP requests
import './Auth.css'; // Import shared CSS file

const Registration = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await api.post('/auth/register', { displayName, email, passwordHash: password });
            setSuccess('Registration successful. You can now log in.');
            setError('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDisplayName('');
        } catch (err) {
            setError('Failed to register. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegistration} className="auth-form">
                <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="auth-input"
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                />
                <button type="submit" className="auth-button">Register</button>
            </form>
            {success && <p className="auth-success">{success}</p>}
            {error && <p className="auth-error">{error}</p>}
        </div>
    );
};

export default Registration;