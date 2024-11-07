// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://yourwebstuddybuddy-backend.onrender.com/', // Adjust based on your backend URL
    withCredentials: true, // This will send cookies along with requests
});

export default api;
