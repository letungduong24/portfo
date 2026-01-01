import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to add error metadata
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Add metadata for 403 Forbidden (demo user)
        if (error.response?.status === 403) {
            error.errorType = 'DEMO_USER_FORBIDDEN';
            error.translationKey = 'Common.demo_user_error';
            error.isHandled = true;
        }

        // Add metadata for 429 Too Many Requests (throttle)
        if (error.response?.status === 429) {
            error.errorType = 'THROTTLE_LIMIT';
            error.translationKey = 'Common.throttle_error';
            error.isHandled = true;
        }

        return Promise.reject(error);
    }
);

export default api;
