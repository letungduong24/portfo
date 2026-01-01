"use client"

import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading, checkAuth } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            checkAuth()
        }
    }, [checkAuth, user])

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}
