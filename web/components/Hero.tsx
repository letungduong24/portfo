"use client"

import { Github, Facebook, Linkedin, Mail, Briefcase } from "lucide-react";
import { Link } from '@/i18n/navigation';
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ProfileCard from "./ProfileCard";
import { useProfileStore } from "@/store/use-profile-store";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {
    const { profile, isLoading } = useProfileStore();
    const t = useTranslations('HomePage.Hero');
    const locale = useLocale();

    const headline = (locale === 'en' ? profile?.headlineEn : profile?.headlineVi) || t('headline');
    const subheadline = (locale === 'en' ? profile?.subheadlineEn : profile?.subheadlineVi) || t('subheadline');
    const desc1 = (locale === 'en' ? profile?.desc1En : profile?.desc1Vi) || t('desc1');
    const desc2 = (locale === 'en' ? profile?.desc2En : profile?.desc2Vi) || t('desc2');

    const {
        github = "https://github.com",
        facebook = "https://facebook.com",
        linkedin = "https://linkedin.com",
        email = "mailto:example@gmail.com",
    } = profile || {};

    if (isLoading) {
        return (
            <section className="flex w-full justify-center">
                <div className="max-w-5xl flex w-full flex-col items-center md:flex-row gap-8 p-3 md:p-6">
                    <Skeleton className="size-50 rounded-full md:size-60 lg:size-70" />
                    <div className="flex flex-col gap-4 w-full md:w-auto flex-1 items-center md:items-start">
                        <Skeleton className="h-10 w-3/4 md:w-1/2" />
                        <Skeleton className="h-8 w-1/2 md:w-1/3" />
                        <div className="space-y-2 w-full max-w-2xl">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="flex w-full justify-center">
            {/* Content */}
            <div className="max-w-5xl flex items-center justify-center p-3 md:p-6">
                <div className="flex flex-col items-center md:flex-row gap-8 text-center md:text-left">
                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <ProfileCard
                            avatarUrl={profile?.avatarUrl || "/avatar.png"}
                            className="size-50 md:size-60 lg:size-70"
                        />
                    </motion.div>

                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        {/* Heading */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                                {headline}
                            </h1>
                            <h2 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                                {subheadline}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="max-w-2xl text-base text-muted-foreground md:text-lg">
                            <p>{desc1}</p>
                            <p>{desc2}</p>
                        </div>

                        {/* Buttons and Social Links */}
                        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
                            <Button variant="default" size="default" asChild>
                                <Link href="/projects">
                                    <Briefcase className="h-4 w-4" />
                                    {t('view_projects')}
                                </Link>
                            </Button>

                            {/* Divider */}
                            <div className="hidden h-6 w-px bg-border md:block" />

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    aria-label="GitHub"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href={email}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    aria-label="Mail"
                                >
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
