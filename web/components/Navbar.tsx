'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { Menu, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageToggle } from './LanguageToggle';
import { useProfileStore, Profile } from '@/store/use-profile-store';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('Navbar');
    const locale = useLocale();
    const router = useRouter();
    const { profile } = useProfileStore();

    const formSchema = z.object({
        name: z.string().min(2, {
            message: t('hire_me.validation.name_min'),
        }),
        email: z.string().email({
            message: t('hire_me.validation.email_invalid'),
        }),
        message: z.string().min(5, {
            message: t('hire_me.validation.message_min'),
        }).max(1000, {
            message: t('hire_me.validation.message_max'),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const getLabel = (viKey: keyof Profile, enKey: keyof Profile, fallbackKey: string) => {
        if (!profile) return t(fallbackKey);
        // @ts-ignore
        return (locale === 'vi' ? profile[viKey] : profile[enKey]) as string || t(fallbackKey);
    };

    const navbarName = getLabel('navbarNameVi', 'navbarNameEn', 'logo_fallback');

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/projects', label: t('projects') },
        { href: '/blogs', label: t('blogs') },
    ];

    const showHireMe = profile?.showHireMe ?? true;
    const hireMeLabel = getLabel('navHireMeVi', 'navHireMeEn', 'hire_me.title');

    const handleHireMeClick = () => {
        setIsDialogOpen(true);
        setIsMenuOpen(false);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await import('@/lib/axios').then(mod => mod.default.post('/hire-me', values));
            toast.success(t('hire_me.success_message'));
            setIsDialogOpen(false);
            form.reset();
        } catch (error: any) {
            console.error('Failed to send message:', error);
            // Error is already handled by AxiosErrorHandler - no need to show toast here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <nav className="fixed top-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-3 md:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-2xl">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                className="text-xl font-bold text-white transition-colors hover:text-white/80"
                            >
                                Duong
                            </Link>

                            <div className="hidden items-center gap-8 md:flex">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="hidden md:flex items-center gap-2">
                                <LanguageToggle />
                                {showHireMe && (
                                    <Button variant="default" size="sm" onClick={handleHireMeClick}>
                                        {hireMeLabel}
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 md:hidden">
                                <LanguageToggle />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>

                        {isMenuOpen && (
                            <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 md:hidden">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {showHireMe && (
                                    <Button variant="default" size="sm" className="w-full" onClick={handleHireMeClick}>
                                        {hireMeLabel}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{hireMeLabel}</DialogTitle>
                        <DialogDescription>
                            {t('hire_me.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('hire_me.name')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('hire_me.email')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('hire_me.message')}</FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('hire_me.send')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
