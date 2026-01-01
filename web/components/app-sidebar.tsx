"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/use-auth-store"
import { LogOut, Settings, User, Globe, Home, PanelBottom, Navigation, Layers, Folder, FileText, MessageSquare } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { logout } = useAuthStore()
    const t = useTranslations('Sidebar')
    const tNavbar = useTranslations('Navbar') // Reuse generic language label or specific

    // Menu items.
    const items = [
        {
            title: t('profile'),
            url: "/admin",
            icon: User,
        },
        {
            title: t('projects'),
            url: "/admin/projects",
            icon: Folder,
        },
        {
            title: "Blogs",
            url: "/admin/blogs",
            icon: FileText,
        },
        {
            title: t('footer_management') || "Footer Management",
            url: "/admin/footer",
            icon: Layers,
        },
        {
            title: t('navbar_management') || "Navbar Management",
            url: "/admin/navbar",
            icon: Navigation,
        },
        {
            title: "Hire Me Messages",
            url: "/admin/hire-me",
            icon: MessageSquare,
        },
        {
            title: t('settings'),
            url: "/admin/settings",
            icon: Settings,
        },
    ]

    const handleLogout = async () => {
        await logout()
    }

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
                    <span className="font-semibold group-data-[collapsible=icon]:hidden">Admin</span>
                    <SidebarTrigger className="group-data-[collapsible=icon]:!static" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t('application')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <Home />
                                <span>{t('home')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Globe />
                                    <span>{tNavbar('language')}</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start">
                                <DropdownMenuItem onClick={() => switchLocale("vi")}>
                                    Tiếng Việt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => switchLocale("en")}>
                                    English
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>{t('logout')}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
