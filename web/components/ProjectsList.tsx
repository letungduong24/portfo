"use client";

import { Folder, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Project } from "@/store/use-project-store";

export default function ProjectsList() {
    const locale = useLocale();
    const t = useTranslations('HomePage.Projects');

    const {
        data: projects,
        isLoading,
        hasMore,
        lastElementRef,
        handleSearch,
        search
    } = useInfiniteScroll<Project>({
        endpoint: '/projects',
        limit: 9
    });

    const isInitialLoading = isLoading && projects.length === 0;

    return (
        <div className="min-h-screen w-full">
            <div className="container mx-auto max-w-5xl px-3 md:px-6 py-10 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                        {t('all_projects')}
                    </h1>
                    <p className="mt-3 text-white/70">
                        {t('all_projects_desc')}
                    </p>

                    {/* Search Input */}
                    <div className="mt-6 max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                            placeholder={t('search_placeholder')}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 rounded-xl"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </motion.div>

                {isInitialLoading ? (
                    <div className="flex flex-wrap gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl flex-1 min-w-[280px]">
                                <Skeleton className="h-48 w-full bg-white/10" />
                                <div className="flex flex-1 flex-col p-6 space-y-3">
                                    <Skeleton className="h-6 w-3/4 bg-white/10" />
                                    <Skeleton className="h-4 w-full bg-white/10" />
                                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                                    <div className="mt-auto flex gap-2">
                                        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                                        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                                        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-white">{t('no_projects')}</h2>
                        <p className="text-white/70 mt-2">{t('check_back')}</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6">
                        {projects.map((project, index) => {
                            const title = locale === 'vi' ? project.titleVi : project.titleEn;
                            const description = locale === 'vi' ? project.descriptionVi : project.descriptionEn;

                            return (
                                <Link
                                    ref={index === projects.length - 1 ? lastElementRef : null}
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl flex-1 min-w-[280px]"
                                >
                                    {/* Project Thumbnail */}
                                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-white/5">
                                        {project.thumbnailUrl ? (
                                            <NextImage
                                                src={project.thumbnailUrl}
                                                alt={title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/20">
                                                <Folder className="h-12 w-12 opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                                {title}
                                            </h3>
                                        </div>

                                        <p className="mb-4 text-sm text-white/70 line-clamp-2">
                                            {description}
                                        </p>

                                        <div className="mt-auto flex flex-wrap gap-2">
                                            {project.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags.length > 3 && (
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                                                    +{project.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {isLoading && !isInitialLoading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}
