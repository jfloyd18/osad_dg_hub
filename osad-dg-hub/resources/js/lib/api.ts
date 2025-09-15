// src/lib/api.js or wherever your apiClient is defined

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Your Laravel backend URL
    withCredentials: true, // ✅ THIS IS THE CRUCIAL PART
});

// This is needed for Laravel Sanctum's CSRF protection
apiClient.get('/sanctum/csrf-cookie');

export default apiClient;