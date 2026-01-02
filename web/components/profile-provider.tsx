"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/store/use-profile-store";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>;
}
