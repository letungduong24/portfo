"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

export default function TechStack() {
    const { profile, isLoading } = useProfileStore();
    const t = useTranslations('HomePage.TechStack');
    const locale = useLocale();

    const techStacks = profile?.skillGroups || [];

    if (isLoading) {
        return (
            <section className="flex w-full justify-center">
                <div className="container mx-auto max-w-5xl p-3 md:p-6 space-y-4">
                    <div className="text-center space-y-2 flex flex-col items-center">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="flex flex-wrap gap-6 w-full">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-1 min-w-[140px] md:min-w-[160px] flex-col items-center gap-3 rounded-xl border border-border/20 bg-background/20 p-6 backdrop-blur-md">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
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
            <div className="container mx-auto max-w-5xl p-3 md:p-6 space-y-4">
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

                {/* Tech Stacks Display */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className=""
                >
                    <div className="flex flex-wrap gap-6 w-full">
                        {techStacks.map((tech) => (
                            <div
                                key={tech.id}
                                className="group flex flex-1 min-w-[140px] md:min-w-[160px] flex-col items-center gap-3 rounded-xl border border-border/20 bg-background/20 p-6 backdrop-blur-md transition-all hover:border-foreground/30 hover:bg-background/30 hover:shadow-lg"
                            >
                                <div className="relative h-12 w-12 transition-transform group-hover:scale-110 brightness-0 invert dark:brightness-100 dark:invert-0">
                                    <Image
                                        src={tech.icon}
                                        alt={locale === 'en' ? tech.nameEn : tech.nameVi}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-medium text-foreground">
                                        {locale === 'en' ? tech.nameEn : tech.nameVi}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
