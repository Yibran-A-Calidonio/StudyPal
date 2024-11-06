// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/study', // Adjust based on your backend URL
    withCredentials: true, // This will send cookies along with requests
});

export default api;
