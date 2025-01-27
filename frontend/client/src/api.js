import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5251/api', // Use your backend's local development URL
    withCredentials: false, // Set to true if your backend requires cookies (e.g., for sessions)
});

export default api;