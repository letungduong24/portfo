import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import AuthGuard from "@/components/auth-guard"
import { ProfileProvider } from "@/components/profile-provider"
import { useTranslations } from "next-intl"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Sidebar');

    return (
        <AuthGuard>
            <ProfileProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full">
                        <header className="flex h-14 items-center gap-2 border-b bg-background/40 backdrop-blur-md px-4 fixed top-0 left-0 right-0 z-50 md:hidden">
                            <SidebarTrigger />
                            <span className="font-semibold">{t('dashboard')}</span>
                        </header>
                        <div className="p-4 mt-14 md:mt-0">
                            {children}
                        </div>
                    </main>
                </SidebarProvider>
            </ProfileProvider>
        </AuthGuard>
    )
}
