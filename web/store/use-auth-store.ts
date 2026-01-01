import { create } from 'zustand'

interface User {
    id: number
    email: string
    name: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    isLoggingIn: boolean
    error: string | null
    checkAuth: () => Promise<void>
    login: (values: any) => Promise<void>
    logout: () => Promise<void>
    setUser: (user: User | null) => void
}

import api from '@/lib/axios'

// ... (interfaces remain same)

export const useAuthStore = create<AuthState>((set: any) => ({
    user: null,
    isLoading: true, // For initial check
    isLoggingIn: false, // For login action
    error: null,
    setUser: (user: User | null) => set({ user }),
    checkAuth: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/auth/profile')
            set({ user: res.data })
        } catch (error) {
            set({ user: null })
        } finally {
            set({ isLoading: false })
        }
    },
    login: async (values: any) => {
        set({ isLoggingIn: true, error: null })
        try {
            await api.post('/auth/login', values)
            const res = await api.get('/auth/profile')
            set({ user: res.data })
        } catch (error) {
            set({ error: 'login_failed' })
            throw error
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        try {
            await api.post('/auth/logout')
            set({ user: null })
        } catch (error) {
            console.error('Logout failed', error)
        }
    },
}))
