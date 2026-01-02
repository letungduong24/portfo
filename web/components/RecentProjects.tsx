"use client";

import { Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from 'next-intl';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { useProjectStore } from "@/store/use-project-store";
import Image from "next/image";
import { useEffect } from 'react';

export default function RecentProjects() {
    const { isLoading: isProfileLoading } = useProfileStore();
    const { projects, fetchProjects, isLoading: isProjectsLoading } = useProjectStore();
    const t = useTranslations('HomePage.Projects');
    const locale = useLocale();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const isLoading = isProfileLoading || isProjectsLoading;
    const displayedProjects = projects.slice(0, 4);

    if (isLoading && projects.length === 0) {
        return (
            <section id="projects" className="flex w-full justify-center">
                <div className="container mx-auto max-w-5xl p-6 space-y-4">
                    <div className="text-center space-y-2 flex flex-col items-center">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border/20 bg-background/20 shadow-sm backdrop-blur-md flex-1 min-w-[280px]">
                                <Skeleton className="h-48 w-full" />
                                <div className="flex flex-1 flex-col p-6 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <div className="mt-auto flex gap-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Fallback if no projects
    if (projects.length === 0) {
        return null;
    }

    return (
        <section id="projects" className="flex w-full justify-center">
            <div className="container mx-auto max-w-5xl p-6 space-y-4">
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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-6"
                >
                    {displayedProjects.map((project, index) => {
                        const title = locale === 'vi' ? project.titleVi : project.titleEn;
                        const description = locale === 'vi' ? project.descriptionVi : project.descriptionEn;

                        return (
                            <Link
                                key={project.id}
                                href={`/projects/${project.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl flex-1 min-w-[280px]"
                            >
                                {/* Project Thumbnail */}
                                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted/50">
                                    {project.thumbnailUrl ? (
                                        <Image
                                            src={project.thumbnailUrl}
                                            alt={title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <Folder className="h-12 w-12 opacity-20" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-3">
                                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {title}
                                        </h3>
                                    </div>

                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                        {description}
                                    </p>

                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {project.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {project.tags.length > 3 && (
                                            <span className="rounded-full bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                                                +{project.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </motion.div>

                {projects.length > 4 && (
                    <div className="flex justify-center">
                        <Button asChild variant="outline" size="lg" className="group">
                            <Link href="/projects">
                                {t('view_all')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
