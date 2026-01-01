'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { useProfileStore } from '@/store/use-profile-store';
import { useEffect } from 'react';

interface NavbarProviderProps {
    children: React.ReactNode;
}

export default function NavbarProvider({ children }: NavbarProviderProps) {
    const pathname = usePathname();
    // Check if path contains /admin (handling /en/admin, /vi/admin)
    const isAdmin = pathname.includes('/admin');

    const { fetchProfile, profile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col z-10">
            <Navbar />
            <div className="flex flex-1 flex-col pt-24">
                {children}
            </div>
            <Footer />
        </div>
    );
}
