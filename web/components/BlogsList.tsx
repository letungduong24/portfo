"use client";

import { FileText, Calendar, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Blog } from '@/store/use-blog-store';

export default function BlogsList() {
    const locale = useLocale();
    const t = useTranslations('BlogsPage');

    const {
        data: blogs,
        isLoading,
        hasMore,
        lastElementRef,
        handleSearch,
        search
    } = useInfiniteScroll<Blog>({
        endpoint: '/blogs',
        limit: 9
    });

    const isInitialLoading = isLoading && blogs.length === 0;

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
                        {t('title')}
                    </h1>
                    <p className="mt-3 text-white/70">
                        {t('description')}
                    </p>

                    {/* Search Input */}
                    <div className="mt-6 max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                            placeholder={t('search_placeholder') || "Search blogs..."}
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-white">{t('no_posts')}</h2>
                        <p className="text-white/70 mt-2">{t('no_posts_desc')}</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6">
                        {blogs.map((blog, index) => {
                            const title = locale === 'vi' ? blog.titleVi : (blog.titleEn || blog.titleVi);
                            const date = new Date(blog.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            return (
                                <Link
                                    ref={index === blogs.length - 1 ? lastElementRef : null}
                                    key={blog.id}
                                    href={`/blogs/${blog.slug}`}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl flex-1 min-w-[280px]"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-white/5">
                                        {blog.thumbnail ? (
                                            <Image
                                                src={blog.thumbnail}
                                                alt={title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/20">
                                                <FileText className="h-12 w-12 opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                                            <Calendar className="h-3 w-3" />
                                            <span>{date}</span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2 line-clamp-2">
                                            {title}
                                        </h3>

                                        <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                            {blog.tags.slice(0, 3).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="rounded-full bg-white/10 text-white hover:bg-white/20 px-2.5 py-0.5 text-xs font-medium border-none"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {blog.tags.length > 3 && (
                                                <Badge variant="secondary" className="rounded-full bg-white/5 text-white/60 px-2.5 py-0.5 text-xs font-medium border-none">
                                                    +{blog.tags.length - 3}
                                                </Badge>
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
