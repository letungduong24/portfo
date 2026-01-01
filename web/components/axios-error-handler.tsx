"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

import { useTranslations } from 'next-intl';

export function AxiosErrorHandler() {
    const t = useTranslations();
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                // Show toast for errors with translationKey or userMessage
                if (error.isHandled) {
                    if (error.translationKey) {
                        toast.error(t(error.translationKey));
                    } else if (error.userMessage) {
                        toast.error(error.userMessage);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return null;
}
