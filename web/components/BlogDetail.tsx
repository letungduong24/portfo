'use client';

import { useEffect } from 'react';
import { useBlogStore } from '@/store/use-blog-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface BlogDetailProps {
    slug: string;
}

export default function BlogDetail({ slug }: BlogDetailProps) {
    const { selectedBlog, fetchBlogBySlug, isLoading, error } = useBlogStore();
    const locale = useLocale();
    const t = useTranslations('BlogsPage');

    useEffect(() => {
        if (slug) {
            fetchBlogBySlug(slug);
        }
    }, [slug, fetchBlogBySlug]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-destructive">Blog not found or error loading.</p>
            </div>
        );
    }

    if (isLoading || !selectedBlog) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen">
                <div className="max-w-3xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    const title = locale === 'vi' ? selectedBlog.titleVi : (selectedBlog.titleEn || selectedBlog.titleVi);
    const content = locale === 'vi' ? selectedBlog.contentVi : (selectedBlog.contentEn || selectedBlog.contentVi);

    // Basic calculation for reading time
    const strippedContent = content.replace(/<[^>]*>?/gm, '');
    const wordCount = strippedContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <article className="min-h-screen pb-20">
            {/* Header / Hero */}
            <div>
                <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                            {selectedBlog.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-sm font-normal px-3 py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                            {title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(selectedBlog.createdAt).toLocaleDateString(locale, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{t('min_read', { minutes: readingTime })}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-12 relative z-10">
                {selectedBlog.thumbnail && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-2xl overflow-hidden shadow-2xl border bg-background mb-12 aspect-video relative"
                    >
                        <Image
                            src={selectedBlog.thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </article>
    );
}
