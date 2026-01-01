"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useProjectStore } from "@/store/use-project-store";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Folder, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function AdminProjectsPage() {
    const t = useTranslations("Admin.Projects");
    const { deleteProject } = useProjectStore();
    const router = useRouter();
    const locale = useLocale();

    const {
        data: projects,
        isLoading,
        hasMore,
        lastElementRef,
        handleSearch,
        search,
        setData: setProjects
    } = useInfiniteScroll<any>({ // Use Project type if available
        endpoint: '/projects',
        limit: 9
    });

    const isInitialLoading = isLoading && projects.length === 0;

    const handleDelete = async (id: number) => {
        try {
            await deleteProject(id);
            // Update local state
            setProjects(prev => prev.filter(p => p.id !== id));
            toast.success("Project deleted successfully");
        } catch (error: any) {
            console.error("Failed to delete project", error);
            if (!error.isHandled) {
                toast.error("Failed to delete project");
            }
        }
    };

    if (isLoading && projects.length === 0) {
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
                            placeholder={t('search_placeholder') || "Search projects..."}
                            className="pl-10"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Button asChild>
                        <Link href="/admin/projects/compose">
                            <Plus className="mr-2 h-4 w-4" /> {t('add_project')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => {
                    const title = locale === 'vi' ? project.titleVi : project.titleEn;
                    const description = locale === 'vi' ? project.descriptionVi : project.descriptionEn;

                    return (
                        <div key={project.id} ref={index === projects.length - 1 ? lastElementRef : null} className="contents">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={`/admin/projects/compose?id=${project.id}`}>
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
                                                    <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('delete_confirm_desc', { name: title })}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(project.id)}>
                                                        {t('delete')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                {projects.length === 0 && (
                    <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Folder className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="mt-6 text-xl font-semibold">{t('no_projects_title')}</h2>
                        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground max-w-sm">
                            {t('no_projects_desc')}
                        </p>
                        <Button asChild>
                            <Link href="/admin/projects/compose">
                                <Plus className="mr-2 h-4 w-4" /> {t('add_project')}
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
