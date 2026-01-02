"use client";

import { FileText, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from 'next-intl';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/store/use-profile-store";
import { useBlogStore } from "@/store/use-blog-store";
import Image from "next/image";
import { useEffect } from 'react';

export default function RecentBlogs() {
    const { isLoading: isProfileLoading } = useProfileStore();
    const { blogs, fetchBlogs, isLoading: isBlogsLoading } = useBlogStore();
    const t = useTranslations('HomePage.RecentBlogs');
    const locale = useLocale();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const isLoading = isProfileLoading || isBlogsLoading;
    const displayedBlogs = blogs.slice(0, 4); // Display max 4 blogs

    if (isLoading && blogs.length === 0) {
        return (
            <section id="blogs" className="flex w-full justify-center">
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
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Fallback if no blogs
    if (blogs.length === 0) {
        return null;
    }

    return (
        <section id="blogs" className="flex w-full justify-center">
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
                    {displayedBlogs.map((blog) => {
                        const title = locale === 'vi' ? blog.titleVi : blog.titleEn;
                        // Use a short snippet or description. Blog model might not have description, so fallback to content snippet.
                        // Assuming content is HTML, strip it or just use title/date for now if no dedicated excerpt field.
                        // Wait, blog model has contentVi/En. Let's use that but truncated? 
                        // Or maybe we should improve backend to return excerpt. For now, just title + date + thumbnail.

                        const date = new Date(blog.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        return (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl flex-1 min-w-[280px]"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted/50">
                                    {blog.thumbnail ? (
                                        <Image
                                            src={blog.thumbnail}
                                            alt={title || 'Blog thumbnail'}
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
                                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{date}</span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                        {title}
                                    </h3>

                                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                        {blog.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </motion.div>

                {blogs.length > 4 && (
                    <div className="flex justify-center mt-8">
                        <Button asChild variant="outline" size="lg" className="group">
                            <Link href="/blogs">
                                {t('view_all')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
