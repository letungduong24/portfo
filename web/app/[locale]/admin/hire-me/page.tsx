"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Eye, Mail, User, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface HireMeMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export default function AdminHireMePage() {
    const t = useTranslations('Admin.HireMe');

    const {
        data: messages,
        isLoading,
        lastElementRef,
        handleSearch,
        search,
        setData: setMessages
    } = useInfiniteScroll<HireMeMessage>({
        endpoint: '/hire-me',
        limit: 12
    });

    const [selectedMessage, setSelectedMessage] = useState<HireMeMessage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hireMeEmail, setHireMeEmail] = useState('');
    const [isSavingEmail, setIsSavingEmail] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile');
            setHireMeEmail(res.data.hireMeEmail || '');
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleSaveEmail = async () => {
        setIsSavingEmail(true);
        try {
            const profileRes = await api.get('/profile');
            await api.patch(`/profile/${profileRes.data.id}`, { hireMeEmail });
            toast.success(t('toast.save_email_success'));
        } catch (error: any) {
            console.error("Failed to save email", error);
            if (!error.isHandled) {
                toast.error(t('toast.save_email_error'));
            }
        } finally {
            setIsSavingEmail(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/hire-me/${id}`);
            toast.success(t('toast.delete_success'));
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setIsDialogOpen(false);
                setSelectedMessage(null);
            }
        } catch (error: any) {
            console.error("Failed to delete message", error);
            if (!error.isHandled) {
                toast.error(t('toast.delete_error'));
            }
        }
    };

    const handleViewMessage = (message: HireMeMessage) => {
        setSelectedMessage(message);
        setIsDialogOpen(true);
    };

    const isInitialLoading = isLoading && messages.length === 0;

    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-24 w-full" />
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
                    <p className="text-sm text-muted-foreground">{t('description')}</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search_placeholder') || "Search messages..."}
                        className="pl-10"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Email Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('email_config.title')}</CardTitle>
                    <CardDescription>
                        {t('email_config.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="hireMeEmail">{t('email_config.label')}</Label>
                            <Input
                                id="hireMeEmail"
                                type="email"
                                value={hireMeEmail}
                                onChange={(e) => setHireMeEmail(e.target.value)}
                                placeholder="your-email@example.com"
                            />
                        </div>
                        <Button onClick={handleSaveEmail} disabled={isSavingEmail}>
                            {isSavingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('email_config.save_button')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Messages Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg, index) => (
                    <div key={msg.id} ref={index === messages.length - 1 ? lastElementRef : null} className="contents">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="line-clamp-1 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {msg.name}
                                    </CardTitle>
                                </div>
                                <CardDescription className="flex items-center gap-1 min-w-0">
                                    <Mail className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{msg.email}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {msg.message}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleViewMessage(msg)}>
                                        <Eye className="h-4 w-4" />
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
                                                <AlertDialogAction onClick={() => handleDelete(msg.id)} className="bg-destructive hover:bg-destructive/90">
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

                {messages.length === 0 && (
                    <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Mail className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="mt-6 text-xl font-semibold">{t('empty')}</h2>
                        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground max-w-sm">
                            {t('empty')}
                        </p>
                    </div>
                )}

                {isLoading && !isInitialLoading && (
                    <div className="col-span-full flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {/* View Message Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('view_detail')}</DialogTitle>
                        <DialogDescription>
                            {selectedMessage && format(new Date(selectedMessage.createdAt), "PPP p")}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">{t('table.name')}</Label>
                                    <p className="text-sm font-medium">{selectedMessage.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">{t('table.email')}</Label>
                                    <p className="text-sm font-medium break-all">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{t('table.message')}</Label>
                                <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap wrap-break-word max-h-[400px] overflow-y-auto" style={{ overflowWrap: 'anywhere' }}>
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
