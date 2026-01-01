'use client';

import { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/use-blog-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function AdminBlogsPage() {
    const { deleteBlog } = useBlogStore();
    const t = useTranslations('Admin.Blogs');

    const {
        data: blogs,
        isLoading,
        hasMore,
        lastElementRef,
        handleSearch,
        search,
        setData: setBlogs
    } = useInfiniteScroll<any>({
        endpoint: '/blogs/admin/all',
        limit: 12
    });

    const isInitialLoading = isLoading && blogs.length === 0;

    const handleDelete = async (id: number) => {
        try {
            await deleteBlog(id);
            setBlogs(prev => prev.filter(b => b.id !== id));
            toast.success(t('toast.delete_success'));
        } catch (error: any) {
            if (!error.isHandled) {
                toast.error(t('toast.delete_error'));
            }
        }
    };

    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-24" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-medium">{t('title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('description')}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('search_placeholder') || "Search blogs..."}
                            className="pl-10"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Button asChild>
                        <Link href="/admin/blogs/new">
                            <Plus className="mr-2 h-4 w-4" /> {t('create_button')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog, index) => (
                    <div key={blog.id} ref={index === blogs.length - 1 ? lastElementRef : null} className="contents">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="line-clamp-2 flex-1">{blog.titleVi}</CardTitle>
                                    <Badge variant={blog.isPublished ? "default" : "secondary"} className="shrink-0">
                                        {blog.isPublished ? (
                                            <><Eye className="mr-1 h-3 w-3" /> {t('status.published')}</>
                                        ) : (
                                            <><EyeOff className="mr-1 h-3 w-3" /> {t('status.draft')}</>
                                        )}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {blog.excerptVi || blog.slug}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <span>{format(new Date(blog.createdAt), 'dd/MM/yyyy')}</span>
                                    <span>{blog.views} views</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`/admin/blogs/${blog.id}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('delete_dialog.title')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('delete_dialog.description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('delete_dialog.cancel')}</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(blog.id)} className="bg-destructive hover:bg-destructive/90">
                                                    {t('delete_dialog.delete')}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="mt-6 text-xl font-semibold">{t('empty_state')}</h2>
                        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground max-w-sm">
                            {t('empty_state_desc') || 'Start creating your first blog post'}
                        </p>
                        <Button asChild>
                            <Link href="/admin/blogs/new">
                                <Plus className="mr-2 h-4 w-4" /> {t('create_button')}
                            </Link>
                        </Button>
                    </div>
                )}

                {isLoading && !isInitialLoading && (
                    <div className="col-span-full flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}
