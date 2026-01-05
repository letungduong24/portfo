"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

export default function Skills() {
    const { profile, isLoading } = useProfileStore();
    const t = useTranslations('HomePage.Skills');
    const locale = useLocale();

    const skillGroups = profile?.skillGroups || [];

    if (isLoading) {
        return (
            <section className="flex w-full justify-center">
                <div className="container mx-auto max-w-5xl p-6 space-y-6">
                    <div className="text-center space-y-2 flex flex-col items-center">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-border/20 bg-background/20 p-5 md:p-6 backdrop-blur-md space-y-4 flex-1 min-w-[280px] flex flex-col">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-7 w-7 md:h-8 md:w-8 rounded-lg shrink-0" />
                                    <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
                                </div>
                                <div className="flex flex-wrap gap-2 content-start">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Skeleton key={j} className="h-7 md:h-8 w-20 md:w-24 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="flex w-full justify-center">
            <div className="container mx-auto max-w-5xl p-6 space-y-6">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                        {t('title')}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* Skill Groups Display */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-4 md:gap-6"
                >
                    {skillGroups.map((group, groupIndex) => {
                        // Detect if icon is a URL (uploaded) or Lucide icon name
                        const isUrl = group.icon && (group.icon.startsWith('/') || group.icon.startsWith('http'));
                        // @ts-ignore
                        const LucideIcon = !isUrl && group.icon ? LucideIcons[group.icon] : null;

                        return (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                                viewport={{ once: true }}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl flex-1 min-w-[280px] flex flex-col"
                            >
                                {/* Group Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    {group.icon && (
                                        <div className="relative h-7 w-7 md:h-8 md:w-8 brightness-0 invert dark:brightness-100 dark:invert-0 shrink-0">
                                            {isUrl ? (
                                                <Image
                                                    src={group.icon}
                                                    alt={locale === 'en' ? group.nameEn : group.nameVi}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : LucideIcon ? (
                                                <LucideIcon className="h-full w-full" />
                                            ) : null}
                                        </div>
                                    )}
                                    <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight">
                                        {locale === 'en' ? group.nameEn : group.nameVi}
                                    </h3>
                                </div>

                                {/* Skills List */}
                                <div className="flex flex-wrap gap-2 content-start">
                                    {group.skills?.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/40 px-2.5 py-1 text-xs md:text-sm transition-colors hover:border-foreground/60 hover:bg-background/60 h-fit"
                                        >
                                            <span className="font-medium text-foreground">
                                                {locale === 'en' ? skill.nameEn : skill.nameVi}
                                            </span>
                                            {skill.descriptionVi && skill.descriptionEn && (
                                                <span className="text-xs text-muted-foreground">
                                                    ({locale === 'en' ? skill.descriptionEn : skill.descriptionVi})
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
