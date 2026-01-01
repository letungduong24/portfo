import { useEffect } from 'react';
import { toast } from 'sonner';
import api from './axios';

export function useAxiosErrorHandler() {
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                // Show toast for demo user errors
                if (error.errorType === 'DEMO_USER_FORBIDDEN') {
                    toast.error(error.message);
                    error.isHandled = true;
                }

                // Show toast for throttle errors
                if (error.errorType === 'THROTTLE_LIMIT') {
                    toast.error(error.message);
                    error.isHandled = true;
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);
}
