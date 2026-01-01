"use client";

import { Calendar, GraduationCap, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export default function About() {
    const { profile, isLoading } = useProfileStore();
    const t = useTranslations('HomePage.About');
    const locale = useLocale();

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "16/06/2004";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <section id="about" className="flex w-full justify-center">
                <div className="container mx-auto max-w-5xl p-3 md:p-6">
                    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/20 bg-background/20 p-6 shadow-sm backdrop-blur-md md:grid-cols-4 md:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                <div className="flex flex-col gap-2 overflow-hidden w-full">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="flex w-full justify-center">
            <div className="container mx-auto max-w-5xl p-3 md:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-4 rounded-2xl border border-border/20 bg-background/20 p-6 shadow-sm backdrop-blur-md md:grid-cols-4 md:gap-8"
                >
                    {/* Full Name */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-muted-foreground truncate">{t('title')}</span>
                            <span className="font-medium text-sm text-foreground truncate">
                                {locale === 'en' ? profile?.fullNameEn : profile?.fullNameVi || "Le Tung Duong"}
                            </span>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-muted-foreground truncate">{t('dob')}</span>
                            <span className="font-medium text-sm text-foreground truncate">
                                {formatDate(profile?.birthDate)}
                            </span>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="col-span-2 flex items-center gap-3 md:col-span-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-muted-foreground truncate">{t('education')}</span>
                            <span className="font-medium text-sm text-foreground truncate">
                                {locale === 'en' ? profile?.educationEn : profile?.educationVi || "Thuy Loi University - Software Engineering"}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
