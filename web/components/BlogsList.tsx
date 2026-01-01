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
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        {t('title')}
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        {t('description')}
                    </p>

                    {/* Search Input */}
                    <div className="mt-6 max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('search_placeholder') || "Search blogs..."}
                            className="pl-10"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </motion.div>

                {isInitialLoading ? (
                    <div className="flex flex-wrap gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border/20 bg-background/20 shadow-sm backdrop-blur-md flex-1 min-w-[280px]">
                                <Skeleton className="h-48 w-full" />
                                <div className="flex flex-1 flex-col p-6 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold">{t('no_posts')}</h2>
                        <p className="text-muted-foreground mt-2">{t('no_posts_desc')}</p>
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
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/20 bg-background/20 shadow-sm backdrop-blur-md transition-all hover:border-foreground/30 hover:shadow-lg flex-1 min-w-[280px]"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted/50">
                                        {blog.thumbnail ? (
                                            <Image
                                                src={blog.thumbnail}
                                                alt={title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <FileText className="h-12 w-12 opacity-20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <Calendar className="h-3 w-3" />
                                            <span>{date}</span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                            {title}
                                        </h3>

                                        <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                            {blog.tags.slice(0, 3).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {blog.tags.length > 3 && (
                                                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
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
