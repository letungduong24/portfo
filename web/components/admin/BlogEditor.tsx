'use client';

import { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/use-blog-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Languages } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Save, Trash2, Plus, Upload as UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';
import Image from 'next/image';
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
    FormDescription
} from "@/components/ui/form";

interface BlogEditorProps {
    blogId?: number; // If present, edit mode. If null/undefined, create mode.
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
    const { createBlog, updateBlog, fetchBlogById, selectedBlog, isUpdating, isLoading } = useBlogStore();
    const router = useRouter();
    const t = useTranslations('Admin.BlogEditor');

    const formSchema = z.object({
        titleVi: z.string().min(1, t('validation.title_required')),
        titleEn: z.string().optional(),
        slug: z.string().min(1, t('validation.slug_required')),
        contentVi: z.string().min(1, t('validation.content_required')),
        contentEn: z.string().optional(),
        thumbnail: z.string().optional(),
        tags: z.array(z.string()),
        isPublished: z.boolean().default(false),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titleVi: '',
            titleEn: '',
            slug: '',
            contentVi: '',
            contentEn: '',
            thumbnail: '',
            tags: [],
            isPublished: false
        },
    });

    // Watch values for logic dependent on form state
    const { watch, setValue, control } = form;
    const formData = watch();


    const [tagInput, setTagInput] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
    const [showOverwriteAlert, setShowOverwriteAlert] = useState(false);
    const [pendingTranslation, setPendingTranslation] = useState<{ target: 'vi' | 'en' } | null>(null);

    const isEditMode = !!blogId;

    useEffect(() => {
        if (isEditMode && blogId) {
            fetchBlogById(blogId);
        }
    }, [blogId, fetchBlogById, isEditMode]);

    useEffect(() => {
        if (isEditMode && selectedBlog && selectedBlog.id === blogId) {
            form.reset({
                titleVi: selectedBlog.titleVi || '',
                titleEn: selectedBlog.titleEn || '',
                slug: selectedBlog.slug || '',
                contentVi: selectedBlog.contentVi || '',
                contentEn: selectedBlog.contentEn || '',
                thumbnail: selectedBlog.thumbnail || '',
                tags: selectedBlog.tags || [],
                isPublished: selectedBlog.isPublished || false
            });
        }
    }, [selectedBlog, isEditMode, blogId, form]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD') // decompose characters
            .replace(/[\u0300-\u036f]/g, '') // remove accent marks
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '') // remove special chars
            .trim()
            .replace(/\s+/g, '-');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Only auto-generate slug in create mode or if slug is empty
        const currentSlug = form.getValues('slug');
        if (!isEditMode && !currentSlug) {
            setValue('titleVi', title);
            setValue('slug', generateSlug(title));
        } else {
            setValue('titleVi', title);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const res = await api.post('/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setValue('thumbnail', res.data.url);
            toast.success(t('toast.upload_success'));
        } catch (error: any) {
            console.error('Upload error:', error);
            if (!error.isHandled) {
                toast.error(t('toast.upload_error'));
            }
        } finally {
            setIsUploadingImage(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            const currentTags = form.getValues('tags');
            setValue('tags', [...currentTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        const currentTags = form.getValues('tags');
        setValue('tags', currentTags.filter((_, i) => i !== index));
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (isEditMode && blogId) {
                await updateBlog(blogId, values);
                toast.success(t('toast.update_success'));
            } else {
                await createBlog(values);
                toast.success(t('toast.create_success'));
                router.push('/admin/blogs');
            }
        } catch (error: any) {
            console.error(error);
            if (!error.isHandled) {
                if (error.response?.status === 409) {
                    form.setError('slug', { message: t('toast.slug_exists_error') });
                    toast.error(t('toast.slug_exists_error'));
                } else {
                    toast.error(isEditMode ? t('toast.update_error') : t('toast.create_error'));
                }
            }
        }
    };

    if (isEditMode && isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }








    const checkAndTranslate = (targetLang: 'vi' | 'en') => {
        const hasContent = targetLang === 'en'
            ? (formData.titleEn || formData.contentEn)
            : (formData.titleVi || formData.contentVi);

        if (hasContent) {
            setPendingTranslation({ target: targetLang });
            setShowOverwriteAlert(true);
        } else {
            handleTranslate(targetLang);
        }
    };

    const confirmOverwrite = () => {
        if (pendingTranslation) {
            handleTranslate(pendingTranslation.target);
            setPendingTranslation(null);
        }
        setShowOverwriteAlert(false);
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const res = await api.post('/ai/write-blog', { prompt: aiPrompt });
            const generatedData = JSON.parse(res.data.text);

            // Merge generated data with existing data, prioritizing generated
            if (generatedData.titleVi) setValue('titleVi', generatedData.titleVi);
            if (generatedData.titleEn) setValue('titleEn', generatedData.titleEn);
            if (generatedData.slug) setValue('slug', generatedData.slug);
            if (generatedData.contentVi) setValue('contentVi', generatedData.contentVi);
            if (generatedData.contentEn) setValue('contentEn', generatedData.contentEn);
            if (generatedData.tags) setValue('tags', generatedData.tags);
            if (generatedData.isPublished !== undefined) setValue('isPublished', generatedData.isPublished);

            setIsAiDialogOpen(false);
            toast.success(t('ai.success'));
        } catch (error) {
            console.error(error);
            toast.error(t('ai.error'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTranslate = async (targetLang: 'vi' | 'en') => {
        setIsGenerating(true);
        try {
            const sourceTitle = targetLang === 'en' ? formData.titleVi : formData.titleEn;
            const sourceContent = targetLang === 'en' ? formData.contentVi : formData.contentEn;
            const targetLanguage = targetLang === 'en' ? 'English' : 'Vietnamese';

            // Translate Title if source exists
            if (sourceTitle) {
                const res = await api.post('/ai/translate-compose', { text: sourceTitle, targetLanguage });
                setValue(targetLang === 'en' ? 'titleEn' : 'titleVi', res.data.translation);
            }

            // Translate Content if source exists
            if (sourceContent) {
                const res = await api.post('/ai/translate-compose', { text: sourceContent, targetLanguage });
                setValue(targetLang === 'en' ? 'contentEn' : 'contentVi', res.data.translation);
            }

            toast.success(t('ai.success'));
        } catch (error) {
            console.error(error);
            toast.error(t('ai.error'));
        } finally {
            setIsGenerating(false);
        }
    };

    // ... existing render ...

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-10">
                {/* Overwrite Alert Dialog */}
                <AlertDialog open={showOverwriteAlert} onOpenChange={setShowOverwriteAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('ai.overwrite_alert_title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('ai.overwrite_alert_desc')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('ai.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmOverwrite}>{t('ai.confirm')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/blogs">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEditMode ? t('edit_title') : t('create_title')}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="hidden md:flex">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    {t('ai.generate_button')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('ai.dialog_title')}</DialogTitle>
                                    <DialogDescription>
                                        {t('ai.dialog_desc')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Textarea
                                        placeholder={t('ai.prompt_placeholder')}
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        rows={5}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt} type="button">
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        {isGenerating ? t('ai.generating') : t('ai.generate_button')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isEditMode ? t('save_button') : t('publish_button')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Tabs defaultValue="vi" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                                        <TabsTrigger value="en">English</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="vi" className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="titleVi">{t('labels.title_vi')} *</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => checkAndTranslate('vi')}
                                                    disabled={isGenerating}
                                                    type="button"
                                                >
                                                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Languages className="h-3 w-3 mr-1" />}
                                                    {t('ai.translate_from_en')}
                                                </Button>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="titleVi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder={t('labels.title_vi')} onChange={(e) => {
                                                                field.onChange(e);
                                                                handleTitleChange(e);
                                                            }} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('labels.content_vi')} *</Label>
                                            <FormField
                                                control={form.control}
                                                name="contentVi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <RichTextEditor
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder={t('labels.content_vi')}
                                                                className="min-h-[400px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="en" className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="titleEn">{t('labels.title_en')}</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => checkAndTranslate('en')}
                                                    disabled={isGenerating}
                                                    type="button"
                                                >
                                                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Languages className="h-3 w-3 mr-1" />}
                                                    {t('ai.translate_from_vi')}
                                                </Button>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="titleEn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder={t('labels.title_en')} value={field.value || ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('labels.content_en')}</Label>
                                            <FormField
                                                control={form.control}
                                                name="contentEn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <RichTextEditor
                                                                value={field.value || ''}
                                                                onChange={field.onChange}
                                                                placeholder={t('labels.content_en')}
                                                                className="min-h-[400px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="published" className="text-base">{t('labels.published')}</Label>
                                    <FormField
                                        control={form.control}
                                        name="isPublished"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <Label htmlFor="slug">{t('labels.slug')} *</Label>
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="url-friendly-slug" />
                                                </FormControl>
                                                <FormDescription>{t('labels.slug_desc')}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label>{t('labels.thumbnail')}</Label>
                                    <div className="space-y-4">
                                        {formData.thumbnail && (
                                            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                                <Image
                                                    src={formData.thumbnail || ''}
                                                    alt="Thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploadingImage}
                                                className="flex-1"
                                            />
                                            {isUploadingImage && <Loader2 className="h-5 w-5 animate-spin" />}
                                        </div>
                                        {formData.thumbnail && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setValue('thumbnail', '')}
                                            >
                                                {t('labels.remove_image')}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label>{t('labels.tags')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                            placeholder={t('labels.tags_placeholder')}
                                        />
                                        <Button type="button" onClick={addTag} variant="secondary">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags?.map((tag, index) => (
                                            <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                                <span>{tag}</span>
                                                <button onClick={() => removeTag(index)} className="hover:text-destructive" type="button">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
