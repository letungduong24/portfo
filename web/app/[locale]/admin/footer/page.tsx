"use client"

import { useEffect } from "react"
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useProfileStore } from "@/store/use-profile-store"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const footerSchema = z.object({
    footerTitleVi: z.string().optional(),
    footerTitleEn: z.string().optional(),
    copyrightNameVi: z.string().optional(),
    copyrightNameEn: z.string().optional(),
    footerUseProfileContact: z.boolean().optional(),
    footerEmail: z.string().optional(),
    footerGithub: z.string().optional(),
    footerFacebook: z.string().optional(),
    footerLinkedin: z.string().optional(),
})

type FooterFormValues = z.infer<typeof footerSchema>

export default function FooterPage() {
    const { profile, fetchProfile, updateProfile, isLoading, isUpdating } = useProfileStore()
    const t = useTranslations('Profile.sections.footer');
    const tCommon = useTranslations('Profile');
    const tErrors = useTranslations('errors');

    const form = useForm<FooterFormValues>({
        resolver: zodResolver(footerSchema),
        defaultValues: {
            footerTitleVi: "",
            footerTitleEn: "",
            copyrightNameVi: "",
            copyrightNameEn: "",
            footerUseProfileContact: true,
            footerEmail: "",
            footerGithub: "",
            footerFacebook: "",
            footerLinkedin: "",
        },
    })

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    useEffect(() => {
        if (profile) {
            form.reset({
                footerTitleVi: profile.footerTitleVi || "",
                footerTitleEn: profile.footerTitleEn || "",
                copyrightNameVi: profile.copyrightNameVi || "",
                copyrightNameEn: profile.copyrightNameEn || "",
                footerUseProfileContact: profile.footerUseProfileContact ?? true,
                footerEmail: profile.footerEmail || "",
                footerGithub: profile.footerGithub || "",
                footerFacebook: profile.footerFacebook || "",
                footerLinkedin: profile.footerLinkedin || "",
            })
        }
    }, [profile, form])

    const onSubmit = async (data: FooterFormValues) => {
        if (profile?.id) {
            try {
                await updateProfile(profile.id, data);
                toast.success(tCommon('toast.update_success'));
            } catch (err: any) {
                if (!err.isHandled) {
                    const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                    toast.error(tErrors(code));
                }
            }
        }
    }

    if (isLoading && !profile) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Tabs defaultValue="vi" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                                    <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                </TabsList>

                                <TabsContent value="vi" className="space-y-4 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="footerTitleVi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('footer_title')} (VI)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="copyrightNameVi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('copyright_name')} (VI)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                <TabsContent value="en" className="space-y-4 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="footerTitleEn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('footer_title')} (EN)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="copyrightNameEn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('copyright_name')} (EN)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>

                            <div className="border-t pt-4 space-y-4">
                                <h4 className="text-sm font-medium">{t('contact_info_shared')}</h4>
                                <FormField
                                    control={form.control}
                                    name="footerUseProfileContact"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t('use_profile_contact')}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                {!form.watch("footerUseProfileContact") && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="footerEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('contact_email')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="mailto:..." value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="footerGithub"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('github')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="https://github.com/..." value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="footerFacebook"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('facebook')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="https://facebook.com/..." value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="footerLinkedin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('linkedin')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="https://linkedin.com/in/..." value={field.value || ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {tCommon('save')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
