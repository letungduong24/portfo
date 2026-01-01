import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Project {
    id: number;
    slug: string;
    titleVi: string;
    titleEn: string;
    descriptionVi: string;
    descriptionEn: string;
    thumbnailUrl?: string;
    tags: string[];

    // Detailed
    roleVi: string;
    roleEn: string;
    startDate?: Date | string;
    endDate?: Date | string;
    overviewVi: string;
    overviewEn: string;

    // Arrays
    problemVi: string[];
    problemEn: string[];
    solutionVi: string[];
    solutionEn: string[];
    featuresVi: string[];
    featuresEn: string[];
    learnedVi: string[];
    learnedEn: string[];

    // Complex
    techStack: any[]; // Define stricter types if needed matches DTO
    challenges: any[];
    links: { demo?: string; repo?: string; api?: string };
    demoCredentials?: { email?: string; password?: string; noteVi?: string; noteEn?: string };
    architectureVi?: string;
    architectureEn?: string;

    createdAt: string;
    updatedAt: string;
}

interface ProjectState {
    projects: Project[];
    selectedProject: Project | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;

    fetchProjects: () => Promise<void>;
    fetchProjectBySlug: (slug: string) => Promise<void>;
    fetchProjectById: (id: number) => Promise<void>;
    createProject: (data: any) => Promise<void>;
    updateProject: (id: number, data: any) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    selectedProject: null,
    isLoading: false,
    isUpdating: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/projects');
            set({ projects: res.data });
        } catch (error) {
            console.error('Failed to fetch projects', error);
            set({ error: 'Failed' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProjectBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/projects/${slug}`);
            set({ selectedProject: res.data });
        } catch (error) {
            set({ error: 'Failed' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProjectById: async (id: number) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/projects/${id}`);
            set({ selectedProject: res.data });
        } catch (error) {
            set({ error: 'Failed' });
        } finally {
            set({ isLoading: false });
        }
    },

    createProject: async (data: any) => {
        set({ isUpdating: true });
        try {
            const res = await api.post('/projects', data);
            set((state) => ({ projects: [res.data, ...state.projects] }));
            return res.data;
        } catch (error) {
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateProject: async (id: number, data: any) => {
        set({ isUpdating: true });
        try {
            const res = await api.patch(`/projects/${id}`, data);
            set((state) => ({
                projects: state.projects.map((p) => (p.id === id ? res.data : p)),
                selectedProject: res.data,
            }));
            return res.data;
        } catch (error) {
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteProject: async (id: number) => {
        set({ isUpdating: true });
        try {
            await api.delete(`/projects/${id}`);
            set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
            }));
        } catch (error: any) {
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    }
}));
