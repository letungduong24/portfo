"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProjectStore, Project } from "@/store/use-project-store";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, Plus, Sparkles, Languages, Upload as UploadIcon, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";

// Helper components for array fields
const ArrayInputList = ({ control, name, label, placeholder, addItemText }: any) => {
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                        <FormField
                            control={control}
                            name={`${name}.${index}`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input {...field} placeholder={placeholder} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append("")}
            >
                <Plus className="mr-2 h-3 w-3" /> {addItemText || "Add Item"}
            </Button>
        </div>
    );
};

export default function ComposeProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const { createProject, updateProject, fetchProjectById, selectedProject, isLoading, isUpdating } = useProjectStore();
    const t = useTranslations("Admin.ComposeProject");

    // "vi" or "en"
    const [activeTab, setActiveTab] = useState("vi");

    const formSchema = z.object({
        slug: z.string().min(1, t('validation.slug_required')),
        titleVi: z.string().min(1, t('validation.title_required')),
        titleEn: z.string().optional(),
        descriptionVi: z.string().optional(),
        descriptionEn: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        tags: z.array(z.string()),
        roleVi: z.string().optional(),
        roleEn: z.string().optional(),
        overviewVi: z.string().optional(),
        overviewEn: z.string().optional(),
        problemVi: z.array(z.string()),
        problemEn: z.array(z.string()),
        solutionVi: z.array(z.string()),
        solutionEn: z.array(z.string()),
        featuresVi: z.array(z.string()),
        featuresEn: z.array(z.string()),
        learnedVi: z.array(z.string()),
        learnedEn: z.array(z.string()),
        techStack: z.array(z.object({
            name: z.string().min(1, "Name is required"),
            reasonVi: z.string().optional(),
            reasonEn: z.string().optional()
        })),
        challenges: z.array(z.object({
            problemVi: z.string().optional(),
            problemEn: z.string().optional(),
            solutionVi: z.string().optional(),
            solutionEn: z.string().optional(),
            reasonVi: z.string().optional(),
            reasonEn: z.string().optional()
        })),
        links: z.object({
            demo: z.string().optional(),
            repo: z.string().optional(),
            api: z.string().optional()
        }),
        demoCredentials: z.object({
            email: z.string().optional(),
            password: z.string().optional(),
            noteVi: z.string().optional(),
            noteEn: z.string().optional()
        }),
        architectureVi: z.string().optional(),
        architectureEn: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: "",
            titleVi: "",
            titleEn: "",
            descriptionVi: "",
            descriptionEn: "",
            thumbnailUrl: "",
            tags: [],
            roleVi: "",
            roleEn: "",
            overviewVi: "",
            overviewEn: "",
            problemVi: [],
            problemEn: [],
            solutionVi: [],
            solutionEn: [],
            featuresVi: [],
            featuresEn: [],
            learnedVi: [],
            learnedEn: [],
            techStack: [],
            challenges: [],
            links: { demo: "", repo: "", api: "" },
            demoCredentials: { email: "", password: "", noteVi: "", noteEn: "" },
            architectureVi: "",
            architectureEn: "",
        }
    });

    const { control, handleSubmit, reset, setValue, watch, register, formState: { errors } } = form;

    // Tech Stack Field Array
    const techStackField = useFieldArray({ control, name: "techStack" });

    // Challenges Field Array
    const challengesField = useFieldArray({ control, name: "challenges" });

    useEffect(() => {
        if (projectId) {
            fetchProjectById(+projectId);
        }
    }, [projectId, fetchProjectById]);

    useEffect(() => {
        if (selectedProject && projectId) {
            console.log('Loading project data:', selectedProject);
            console.log('Arrays:', {
                problemVi: selectedProject.problemVi,
                solutionVi: selectedProject.solutionVi,
                featuresVi: selectedProject.featuresVi,
                learnedVi: selectedProject.learnedVi
            });
            reset({
                ...selectedProject,
                tags: selectedProject.tags || [],
                problemVi: selectedProject.problemVi || [],
                problemEn: selectedProject.problemEn || [],
                solutionVi: selectedProject.solutionVi || [],
                solutionEn: selectedProject.solutionEn || [],
                featuresVi: selectedProject.featuresVi || [],
                featuresEn: selectedProject.featuresEn || [],
                learnedVi: selectedProject.learnedVi || [],
                learnedEn: selectedProject.learnedEn || [],
                techStack: selectedProject.techStack as any || [],
                challenges: selectedProject.challenges as any || [],
                links: selectedProject.links as any || { demo: "", repo: "", api: "" },
                demoCredentials: selectedProject.demoCredentials as any || { email: "", password: "", noteVi: "", noteEn: "" },
            });
        }
    }, [selectedProject, projectId, reset]);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
            };

            if (projectId) {
                await updateProject(+projectId, payload);
                toast.success(t('update_success'));
                // Stay on current page after update
            } else {
                await createProject(payload);
                toast.success(t('create_success'));
                router.push("/admin/projects");
            }
        } catch (error: any) {
            console.error(error);
            if (!error.isHandled) {
                if (error.response?.status === 409) {
                    toast.error(t('slug_exists_error'));
                } else {
                    toast.error(projectId ? t('update_error') : t('create_error'));
                }
            }
        }
    };

    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Overwrite Warning State
    const [showOverwriteAlert, setShowOverwriteAlert] = useState(false);
    const [pendingTranslation, setPendingTranslation] = useState<{ target: 'vi' | 'en' } | null>(null);

    const checkAndTranslate = (targetLang: 'vi' | 'en') => {
        const currentData = form.getValues();
        // Check if target fields have significant content.
        // For project, there are many fields. Let's check a few key ones or just if *any* exist?
        // Let's check title and description and maybe overview.
        const hasContent = targetLang === 'en'
            ? (currentData.titleEn || currentData.descriptionEn || currentData.overviewEn)
            : (currentData.titleVi || currentData.descriptionVi || currentData.overviewVi);

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

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            form.setValue('thumbnailUrl', res.data.url);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            if (!error.isHandled) {
                toast.error('Failed to upload image');
            }
        } finally {
            setIsUploadingImage(false);
        }
    };

    // AI Generation Handler
    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const res = await api.post('/ai/write-project', { prompt: aiPrompt });
            const generatedData = JSON.parse(res.data.text);

            // Merge generated data with form
            reset({
                ...form.getValues(),
                ...generatedData,
                // Ensure arrays are merged or overwritten correctly if needed, 
                // but JSON.parse usually returns valid types if prompt is good.
                // We might need to ensure techStack/challenges structure matches exactly if AI is loose.
            });
            toast.success(t('ai_success'));
            setIsAiDialogOpen(false);
        } catch (error: any) {
            console.error('AI generation error:', error);
            if (!error.isHandled) {
                toast.error(t('ai_error'));
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // AI Translation Handler
    const handleTranslate = async (targetLang: 'vi' | 'en') => {
        setIsGenerating(true);
        try {
            const currentValues = form.getValues();
            const targetLanguage = targetLang === 'en' ? 'English' : 'Vietnamese';
            const sourceFields: any = {};

            if (targetLang === 'en') {
                if (currentValues.titleVi) sourceFields.titleEn = currentValues.titleVi;
                if (currentValues.descriptionVi) sourceFields.descriptionEn = currentValues.descriptionVi;
                if (currentValues.roleVi) sourceFields.roleEn = currentValues.roleVi;
                if (currentValues.overviewVi) sourceFields.overviewEn = currentValues.overviewVi;
                if (currentValues.architectureVi) sourceFields.architectureEn = currentValues.architectureVi;
                if (currentValues.problemVi?.length) sourceFields.problemEn = currentValues.problemVi;
                if (currentValues.solutionVi?.length) sourceFields.solutionEn = currentValues.solutionVi;
                if (currentValues.featuresVi?.length) sourceFields.featuresEn = currentValues.featuresVi;
                if (currentValues.learnedVi?.length) sourceFields.learnedEn = currentValues.learnedVi;
                if (currentValues.demoCredentials?.noteVi) {
                    sourceFields.demoCredentials = { ...currentValues.demoCredentials, noteEn: currentValues.demoCredentials.noteVi };
                }
                if (currentValues.techStack?.length) {
                    sourceFields.techStack = currentValues.techStack.map((tech: any) => ({
                        name: tech.name,
                        reasonEn: tech.reasonVi || ''
                    }));
                }
                if (currentValues.challenges?.length) {
                    sourceFields.challenges = currentValues.challenges.map((ch: any) => ({
                        problemEn: ch.problemVi || '', solutionEn: ch.solutionVi || '', reasonEn: ch.reasonVi || ''
                    }));
                }
            } else {
                if (currentValues.titleEn) sourceFields.titleVi = currentValues.titleEn;
                if (currentValues.descriptionEn) sourceFields.descriptionVi = currentValues.descriptionEn;
                if (currentValues.roleEn) sourceFields.roleVi = currentValues.roleEn;
                if (currentValues.overviewEn) sourceFields.overviewVi = currentValues.overviewEn;
                if (currentValues.architectureEn) sourceFields.architectureVi = currentValues.architectureEn;
                if (currentValues.problemEn?.length) sourceFields.problemVi = currentValues.problemEn;
                if (currentValues.solutionEn?.length) sourceFields.solutionVi = currentValues.solutionEn;
                if (currentValues.featuresEn?.length) sourceFields.featuresVi = currentValues.featuresEn;
                if (currentValues.learnedEn?.length) sourceFields.learnedVi = currentValues.learnedEn;
                if (currentValues.demoCredentials?.noteEn) {
                    sourceFields.demoCredentials = { ...currentValues.demoCredentials, noteVi: currentValues.demoCredentials.noteEn };
                }
                if (currentValues.techStack?.length) {
                    sourceFields.techStack = currentValues.techStack.map((tech: any) => ({
                        name: tech.name,
                        reasonVi: tech.reasonEn || ''
                    }));
                }
                if (currentValues.challenges?.length) {
                    sourceFields.challenges = currentValues.challenges.map((ch: any) => ({
                        problemVi: ch.problemEn || '', solutionVi: ch.solutionEn || '', reasonVi: ch.reasonEn || ''
                    }));
                }
            }

            const res = await api.post('/ai/translate-compose', {
                text: JSON.stringify(sourceFields),
                targetLanguage
            });

            const translatedData = JSON.parse(res.data.translation);

            // Merge translated data carefully to preserve shared fields
            const mergedData: any = { ...currentValues };

            // Merge simple fields
            Object.keys(translatedData).forEach(key => {
                if (key !== 'techStack' && key !== 'challenges') {
                    (mergedData as any)[key] = (translatedData as any)[key];
                }
            });

            // Merge techStack - preserve name, only update reason fields
            if (translatedData.techStack && currentValues.techStack) {
                mergedData.techStack = currentValues.techStack.map((tech: any, index: number) => ({
                    ...tech,
                    ...((translatedData as any).techStack[index] || {})
                }));
            }

            // Merge challenges - preserve all fields, only update translated ones
            if ((translatedData as any).challenges && currentValues.challenges) {
                mergedData.challenges = currentValues.challenges.map((ch: any, index: number) => ({
                    ...ch,
                    ...((translatedData as any).challenges[index] || {})
                }));
            }

            reset(mergedData);
            toast.success(t('translate_success'));
        } catch (error: any) {
            console.error('Translation error:', error);
            if (!error.isHandled) {
                toast.error(t('translate_error'));
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Overwrite Alert Dialog */}
            <AlertDialog open={showOverwriteAlert} onOpenChange={setShowOverwriteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('overwrite_alert_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('overwrite_alert_desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmOverwrite}>{t('confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/projects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h3 className="text-lg font-medium">
                            {projectId ? t('edit_title') : t('create_title')}
                        </h3>
                    </div>
                </div>

                <div className="shrink-0">
                    <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9" title={t('ai_generate')}>
                                <Sparkles className="mr-2 h-4 w-4 text-white" />
                                {t('ai_generate')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('ai_dialog_title')}</DialogTitle>
                                <DialogDescription>
                                    {t('ai_dialog_desc')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Textarea
                                    placeholder={t('ai_placeholder')}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAiGenerate} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : null}
                                    {t('ai_btn_generate')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    {/* SHARED SETTINGS CARD */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{t('labels.slug')} & {t('labels.links_credentials')}</CardTitle>
                            <CardDescription>Cài đặt chung cho cả 2 ngôn ngữ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('labels.slug')}</Label>
                                <FormField
                                    control={control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="project-alpha" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('labels.tags')}</Label>
                                <ArrayInputList control={control} name="tags" label="" placeholder="Next.js" addItemText={t('buttons.add_item')} />
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="space-y-2">
                                <Label>Thumbnail Image</Label>
                                <div className="space-y-4">
                                    {watch('thumbnailUrl') && (
                                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                            <Image
                                                src={watch('thumbnailUrl') || ''}
                                                alt="Project thumbnail"
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
                                    {watch('thumbnailUrl') && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setValue('thumbnailUrl', '')}
                                        >
                                            Remove Image
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t('labels.demo_url')}</Label>
                                    <FormField
                                        control={control}
                                        name="links.demo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('labels.repo_url')}</Label>
                                    <FormField
                                        control={control}
                                        name="links.repo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t('labels.demo_email')}</Label>
                                    <FormField
                                        control={control}
                                        name="demoCredentials.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('labels.demo_password')}</Label>
                                    <FormField
                                        control={control}
                                        name="demoCredentials.password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Ghi chú (VI)</Label>
                                    <FormField
                                        control={control}
                                        name="demoCredentials.noteVi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Ghi chú về tài khoản demo..." rows={3} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Note (EN)</Label>
                                    <FormField
                                        control={control}
                                        name="demoCredentials.noteEn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Demo account notes..." rows={3} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center w-full lg:w-[450px] gap-2">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* VIETNAMESE TAB */}
                        <TabsContent value="vi" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle>Nội dung Tiếng Việt</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => checkAndTranslate('vi')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                                        {t('translate_from_en')}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>{t('labels.title_vi')}</Label>
                                        <FormField
                                            control={control}
                                            name="titleVi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.desc_vi')}</Label>
                                        <FormField
                                            control={control}
                                            name="descriptionVi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>{t('labels.role_vi')}</Label>
                                            <FormField
                                                control={control}
                                                name="roleVi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.overview_vi')}</Label>
                                        <FormField
                                            control={control}
                                            name="overviewVi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} rows={4} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.architecture_vi')}</Label>
                                        <FormField
                                            control={control}
                                            name="architectureVi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* Note VI removed (duplicate) */}

                                    <Separator />
                                    {/* Arrays VI */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <ArrayInputList control={control} name="problemVi" label={t('labels.problem_vi')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="solutionVi" label={t('labels.solution_vi')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="featuresVi" label={t('labels.features_vi')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="learnedVi" label={t('labels.learned_vi')} addItemText={t('buttons.add_item')} />
                                    </div>

                                    <Separator />
                                    {/* Complex VI: TechStack & Challenges */}
                                    <div className="space-y-4">
                                        <Label className="text-lg">{t('labels.tech_stack')} (VI)</Label>
                                        <div className="space-y-4">
                                            {techStackField.fields.map((field, index) => (
                                                <div key={field.id} className="grid md:grid-cols-12 gap-3 items-center border p-3 rounded-lg bg-muted/40">
                                                    <div className="md:col-span-4">
                                                        <Label className="text-xs text-muted-foreground">Tech Name (Shared)</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`techStack.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Tech Name" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-7">
                                                        <Label className="text-xs text-muted-foreground break-all">Reason (VI)</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`techStack.${index}.reasonVi`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder={t('labels.reason_vi')} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => techStackField.remove(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => techStackField.append({ name: "", reasonVi: "", reasonEn: "" })}>
                                                <Plus className="mr-2 h-4 w-4" /> {t('buttons.add_tech')}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-lg">{t('labels.challenges')} (VI)</Label>
                                        <div className="space-y-4">
                                            {challengesField.fields.map((field, index) => (
                                                <div key={field.id} className="border p-4 rounded-lg relative space-y-3 bg-muted/40">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => challengesField.remove(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <h4 className="font-semibold text-sm">Challenge {index + 1}</h4>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.problem_vi')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.problemVi`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.solution_vi')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.solutionVi`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.reason_vi')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.reasonVi`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => challengesField.append({ problemVi: "", problemEn: "", solutionVi: "", solutionEn: "", reasonVi: "", reasonEn: "" })}>
                                                <Plus className="mr-2 h-4 w-4" /> {t('buttons.add_challenge')}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ENGLISH TAB */}
                        <TabsContent value="en" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle>English Content</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => checkAndTranslate('en')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                                        {t('translate_from_vi')}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>{t('labels.title_en')}</Label>
                                        <FormField
                                            control={control}
                                            name="titleEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.desc_en')}</Label>
                                        <FormField
                                            control={control}
                                            name="descriptionEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>{t('labels.role_en')}</Label>
                                            <FormField
                                                control={control}
                                                name="roleEn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.overview_en')}</Label>
                                        <FormField
                                            control={control}
                                            name="overviewEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} rows={4} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('labels.architecture_en')}</Label>
                                        <FormField
                                            control={control}
                                            name="architectureEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator />
                                    {/* Arrays EN */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <ArrayInputList control={control} name="problemEn" label={t('labels.problem_en')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="solutionEn" label={t('labels.solution_en')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="featuresEn" label={t('labels.features_en')} addItemText={t('buttons.add_item')} />
                                        <ArrayInputList control={control} name="learnedEn" label={t('labels.learned_en')} addItemText={t('buttons.add_item')} />
                                    </div>

                                    <Separator />
                                    {/* Complex EN */}
                                    <div className="space-y-4">
                                        <Label className="text-lg">{t('labels.tech_stack')} (EN)</Label>
                                        <div className="space-y-4">
                                            {techStackField.fields.map((field, index) => (
                                                <div key={field.id} className="grid md:grid-cols-12 gap-3 items-center border p-3 rounded-lg bg-muted/40">
                                                    <div className="md:col-span-4">
                                                        <Label className="text-xs text-muted-foreground">Tech Name (Shared)</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`techStack.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Tech Name" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-7">
                                                        <Label className="text-xs text-muted-foreground">Reason (EN)</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`techStack.${index}.reasonEn`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder={t('labels.reason_en')} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => techStackField.remove(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => techStackField.append({ name: "", reasonVi: "", reasonEn: "" })}>
                                                <Plus className="mr-2 h-4 w-4" /> {t('buttons.add_tech')}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-lg">{t('labels.challenges')} (EN)</Label>
                                        <div className="space-y-4">
                                            {challengesField.fields.map((field, index) => (
                                                <div key={field.id} className="border p-4 rounded-lg relative space-y-3 bg-muted/40">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => challengesField.remove(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <h4 className="font-semibold text-sm">Challenge {index + 1}</h4>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.problem_en')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.problemEn`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.solution_en')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.solutionEn`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('labels.reason_en')}</Label>
                                                        <FormField
                                                            control={control}
                                                            name={`challenges.${index}.reasonEn`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea {...field} value={field.value || ''} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" onClick={() => challengesField.append({ problemVi: "", problemEn: "", solutionVi: "", solutionEn: "", reasonVi: "", reasonEn: "" })}>
                                                <Plus className="mr-2 h-4 w-4" /> {t('buttons.add_challenge')}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.push("/admin/projects")}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {projectId ? t('buttons.update') : t('buttons.create')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
