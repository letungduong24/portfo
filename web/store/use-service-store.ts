import { create } from 'zustand';
import api from '@/lib/axios';

export interface Service {
    id: number;
    titleVi: string;
    titleEn: string;
    descriptionVi: string;
    descriptionEn: string;
    icon: string;
    order: number;
}

interface ServiceState {
    services: Service[];
    isLoading: boolean;
    error: string | null;
    fetchServices: () => Promise<void>;
    createService: (data: any) => Promise<void>;
    updateService: (id: number, data: any) => Promise<void>;
    deleteService: (id: number) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set) => ({
    services: [],
    isLoading: false,
    error: null,

    fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/services');
            set({ services: res.data });
        } catch (error) {
            console.error('Failed to fetch services', error);
            set({ error: 'Failed to fetch services' });
        } finally {
            set({ isLoading: false });
        }
    },

    createService: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/services', data);
            // Don't fetch services here - let the caller refresh profile
        } catch (error) {
            console.error('Failed to create service', error);
            set({ error: 'Failed to create service' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateService: async (id: number, data: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.patch(`/services/${id}`, data);
            // Don't fetch services here - let the caller refresh profile
        } catch (error) {
            console.error('Failed to update service', error);
            set({ error: 'Failed to update service' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteService: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/services/${id}`);
            // Don't fetch services here - let the caller refresh profile
        } catch (error) {
            console.error('Failed to delete service', error);
            set({ error: 'Failed to delete service' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
