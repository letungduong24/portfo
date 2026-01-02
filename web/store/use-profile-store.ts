import { create } from 'zustand';
import axios from "axios";
import api from '@/lib/axios';

export interface Profile {
    id: number;
    headlineVi: string;
    headlineEn: string;
    subheadlineVi: string;
    subheadlineEn: string;
    desc1Vi: string;
    desc1En: string;
    desc2Vi: string;
    desc2En: string;
    fullNameVi: string;
    fullNameEn: string;
    birthDate: string | null;
    educationVi: string;
    educationEn: string;
    github: string;
    facebook: string;
    linkedin: string;
    email: string;
    skillGroups: SkillGroup[];

    // Footer Config
    footerTitleVi: string | null;
    footerTitleEn: string | null;
    copyrightNameVi: string | null;
    copyrightNameEn: string | null;
    footerUseProfileContact: boolean;
    footerEmail: string | null;
    footerGithub: string | null;
    footerFacebook: string | null;
    footerLinkedin: string | null;

    // Navbar Config
    navbarNameVi: string | null;
    navbarNameEn: string | null;
    navHireMeVi: string | null;
    navHireMeEn: string | null;
    showHireMe: boolean;


    // Page Settings
    pageTitle: string | null;
    pageDescription: string | null;
    pageIcon: string | null;
    avatarUrl: string | null;

    // Services (optional, included when fetched with ?include=services)
    services?: Array<{
        id: number;
        titleVi: string;
        titleEn: string;
        descriptionVi: string;
        descriptionEn: string;
        icon: string;
        order: number;
    }>;
}

export interface SkillGroup {
    id: number;
    nameVi: string;
    nameEn: string;
    icon: string;
    order: number;
    profileId?: number;
    skills: Skill[];
}

export interface Skill {
    id: number;
    nameVi: string;
    nameEn: string;
    descriptionVi?: string;
    descriptionEn?: string;
    order: number;
    skillGroupId: number;
}

interface ProfileState {
    profile: Profile | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (id: number, data: Partial<Profile>) => Promise<void>;
    updatePersonalInfo: (id: number, data: { birthDate?: Date | string; avatarUrl?: string }) => Promise<void>;
    updateHero: (id: number, data: Partial<Pick<Profile, 'headlineVi' | 'headlineEn' | 'subheadlineVi' | 'subheadlineEn' | 'desc1Vi' | 'desc1En' | 'desc2Vi' | 'desc2En'>>) => Promise<void>;
    updateEducation: (id: number, data: Partial<Pick<Profile, 'fullNameVi' | 'fullNameEn' | 'educationVi' | 'educationEn'>>) => Promise<void>;
    updateSocialLinks: (id: number, data: Partial<Pick<Profile, 'github' | 'linkedin' | 'facebook' | 'email'>>) => Promise<void>;
    addSkillGroup: (data: Partial<SkillGroup>) => Promise<void>;
    updateSkillGroup: (id: number, data: Partial<SkillGroup>) => Promise<void>;
    deleteSkillGroup: (id: number) => Promise<void>;
    addSkill: (data: Partial<Skill>) => Promise<void>;
    updateSkill: (id: number, data: Partial<Skill>) => Promise<void>;
    deleteSkill: (id: number) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isLoading: true,
    isUpdating: false,
    error: null,

    uploadImage: async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/profile?include=services');
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to fetch profile', error);
            set({ error: 'Failed to fetch profile' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (id: number, data: Partial<Profile>) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/profile/${id}`, data);
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to update profile', error);
            set({ error: 'Failed to update profile' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updatePersonalInfo: async (id: number, data) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/profile/${id}/personal`, data);
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to update personal info', error);
            set({ error: 'Failed to update personal info' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateHero: async (id: number, data) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/profile/${id}/hero`, data);
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to update hero', error);
            set({ error: 'Failed to update hero' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateEducation: async (id: number, data) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/profile/${id}/education`, data);
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to update education', error);
            set({ error: 'Failed to update education' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateSocialLinks: async (id: number, data) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/profile/${id}/social`, data);
            set({ profile: res.data });
        } catch (error) {
            console.error('Failed to update social links', error);
            set({ error: 'Failed to update social links' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    addSkillGroup: async (data: Partial<SkillGroup>) => {
        set({ isUpdating: true, error: null });
        try {
            const profileId = get().profile?.id;
            const payload = { ...data, profileId };

            const res = await api.post('/skill-groups', payload);
            const newGroup = res.data;

            set((state) => ({
                profile: state.profile
                    ? { ...state.profile, skillGroups: [...(state.profile.skillGroups || []), newGroup] }
                    : null
            }));
        } catch (error) {
            console.error('Failed to add skill group', error);
            set({ error: 'Failed to add skill group' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateSkillGroup: async (id: number, data: Partial<SkillGroup>) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/skill-groups/${id}`, data);
            const updatedGroup = res.data;

            set((state) => {
                if (!state.profile) return { profile: null };
                const updatedGroups = state.profile.skillGroups.map(g => g.id === id ? updatedGroup : g);
                return { profile: { ...state.profile, skillGroups: updatedGroups } };
            });
        } catch (error) {
            console.error('Failed to update skill group', error);
            set({ error: 'Failed to update skill group' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteSkillGroup: async (id: number) => {
        set({ isUpdating: true, error: null });
        try {
            await api.delete(`/skill-groups/${id}`);
            set((state) => {
                if (!state.profile) return { profile: null };
                const filteredGroups = state.profile.skillGroups.filter(g => g.id !== id);
                return { profile: { ...state.profile, skillGroups: filteredGroups } };
            });
        } catch (error) {
            console.error('Failed to delete skill group', error);
            set({ error: 'Failed to delete skill group' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    addSkill: async (data: Partial<Skill>) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.post('/skills', data);
            // Re-fetch profile to get updated nested data
            await get().fetchProfile();
        } catch (error) {
            console.error('Failed to add skill', error);
            set({ error: 'Failed to add skill' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateSkill: async (id: number, data: Partial<Skill>) => {
        set({ isUpdating: true, error: null });
        try {
            await api.patch(`/skills/${id}`, data);
            // Re-fetch profile to get updated nested data
            await get().fetchProfile();
        } catch (error) {
            console.error('Failed to update skill', error);
            set({ error: 'Failed to update skill' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteSkill: async (id: number) => {
        set({ isUpdating: true, error: null });
        try {
            await api.delete(`/skills/${id}`);
            // Re-fetch profile to get updated nested data
            await get().fetchProfile();
        } catch (error) {
            console.error('Failed to delete skill', error);
            set({ error: 'Failed to delete skill' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    }
}));
