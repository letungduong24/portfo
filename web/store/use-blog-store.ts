import { create } from 'zustand';
import api from '@/lib/axios';

export interface Blog {
    id: number;
    titleVi: string;
    titleEn?: string;
    slug: string;
    contentVi: string;
    contentEn?: string;
    thumbnail?: string;
    tags: string[];
    isPublished: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
}

interface BlogState {
    blogs: Blog[];
    selectedBlog: Blog | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;

    fetchBlogs: () => Promise<void>;
    fetchAdminBlogs: () => Promise<void>;
    fetchBlogBySlug: (slug: string) => Promise<void>;
    fetchBlogById: (id: number) => Promise<void>;
    createBlog: (data: Partial<Blog>) => Promise<Blog>;
    updateBlog: (id: number, data: Partial<Blog>) => Promise<Blog>;
    deleteBlog: (id: number) => Promise<void>;
    setSelectedBlog: (blog: Blog | null) => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
    blogs: [],
    selectedBlog: null,
    isLoading: false,
    isUpdating: false,
    error: null,

    fetchBlogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/blogs');
            set({ blogs: res.data });
        } catch (error) {
            console.error('Failed to fetch blogs', error);
            set({ error: 'Failed to fetch blogs' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAdminBlogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/blogs/admin/all');
            set({ blogs: res.data });
        } catch (error) {
            console.error('Failed to fetch admin blogs', error);
            set({ error: 'Failed to fetch blogs' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchBlogBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/blogs/${slug}`);
            set({ selectedBlog: res.data });
        } catch (error) {
            console.error(`Failed to fetch blog ${slug}`, error);
            set({ error: 'Failed to fetch blog' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchBlogById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/blogs/id/${id}`);
            set({ selectedBlog: res.data });
        } catch (error) {
            console.error(`Failed to fetch blog ${id}`, error);
            set({ error: 'Failed to fetch blog' });
        } finally {
            set({ isLoading: false });
        }
    },

    createBlog: async (data: Partial<Blog>) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.post('/blogs', data);
            set(state => ({
                blogs: [res.data, ...state.blogs]
            }));
            return res.data;
        } catch (error) {
            console.error('Failed to create blog', error);
            set({ error: 'Failed to create blog' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    updateBlog: async (id: number, data: Partial<Blog>) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await api.patch(`/blogs/${id}`, data);
            set(state => ({
                blogs: state.blogs.map(b => b.id === id ? res.data : b),
                selectedBlog: state.selectedBlog?.id === id ? res.data : state.selectedBlog
            }));
            return res.data;
        } catch (error) {
            console.error('Failed to update blog', error);
            set({ error: 'Failed to update blog' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteBlog: async (id: number) => {
        set({ isUpdating: true, error: null });
        try {
            await api.delete(`/blogs/${id}`);
            set(state => ({
                blogs: state.blogs.filter(b => b.id !== id),
                selectedBlog: state.selectedBlog?.id === id ? null : state.selectedBlog
            }));
        } catch (error) {
            console.error('Failed to delete blog', error);
            set({ error: 'Failed to delete blog' });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    setSelectedBlog: (blog) => set({ selectedBlog: blog }),
}));
