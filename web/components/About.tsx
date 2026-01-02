"use client";

import { Palette, Smartphone, Layout, Code, Monitor, Server, Database, Globe, Briefcase, Search, PenTool } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Map icon strings to Lucide components
const IconMap: { [key: string]: any } = {
    Palette,
    Smartphone,
    Layout,
    Code,
    Monitor,
    Server,
    Database,
    Globe,
    Briefcase,
    Search,
    PenTool
};

export default function About() {
    const { profile, isLoading } = useProfileStore();
    const services = profile?.services || [];
    const t = useTranslations('HomePage.Services');
    const locale = useLocale();

    if (isLoading) {
        return (
            <section className="flex w-full justify-center py-15">
                <div className="max-w-5xl w-full p-6">
                    <div className="space-y-8">
                        <div className="space-y-2 text-center">
                            <Skeleton className="h-8 w-48 mx-auto" />
                            <Skeleton className="h-6 w-64 mx-auto" />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="flex w-full justify-center py-15">
            <div className="max-w-5xl w-full p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                            {t('headline')}
                        </h2>
                    </div>

                    {/* Services Grid - Using flex-wrap like Skills and Projects */}
                    <div className="flex flex-wrap gap-6">
                        {services.map((service, index) => {
                            const IconComponent = IconMap[service.icon] || Code;
                            const title = locale === 'en' ? service.titleEn : service.titleVi;
                            const description = locale === 'en' ? service.descriptionEn : service.descriptionVi;

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 flex-1 min-w-[280px]"
                                >
                                    {/* Icon */}
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white">
                                        <IconComponent className="h-6 w-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-white">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            {description}
                                        </p>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
