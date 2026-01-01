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

const navbarSchema = z.object({
    navbarNameVi: z.string().optional(),
    navbarNameEn: z.string().optional(),
    showHireMe: z.boolean().optional(),
    navHireMeVi: z.string().optional(),
    navHireMeEn: z.string().optional(),
})

type NavbarFormValues = z.infer<typeof navbarSchema>

export default function NavbarPage() {
    const { profile, fetchProfile, updateProfile, isLoading, isUpdating } = useProfileStore()
    const t = useTranslations('Profile.sections.navbar');
    const tCommon = useTranslations('Profile');
    const tErrors = useTranslations('errors');

    const form = useForm<NavbarFormValues>({
        resolver: zodResolver(navbarSchema),
        defaultValues: {
            navbarNameVi: "",
            navbarNameEn: "",
            showHireMe: true,
            navHireMeVi: "",
            navHireMeEn: "",
        },
    })

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    useEffect(() => {
        if (profile) {
            form.reset({
                navbarNameVi: profile.navbarNameVi || "",
                navbarNameEn: profile.navbarNameEn || "",
                showHireMe: profile.showHireMe ?? true,
                navHireMeVi: profile.navHireMeVi || "",
                navHireMeEn: profile.navHireMeEn || "",
            })
        }
    }, [profile, form])

    const onSubmit = async (data: NavbarFormValues) => {
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
                    <CardTitle>{t('navbar_name')} & {t('hire_me_button')}</CardTitle>
                    <CardDescription>{t('navbar_name_desc')}</CardDescription>
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
                                        name="navbarNameVi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('navbar_name')} (VI)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Dương" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch("showHireMe") && (
                                        <FormField
                                            control={form.control}
                                            name="navHireMeVi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('hire_me_button')} Text (VI)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </TabsContent>

                                <TabsContent value="en" className="space-y-4 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="navbarNameEn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('navbar_name')} (EN)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Duong" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch("showHireMe") && (
                                        <FormField
                                            control={form.control}
                                            name="navHireMeEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('hire_me_button')} Text (EN)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>

                            <div className="border-t pt-4 space-y-4">
                                <h4 className="text-sm font-medium">Shared Settings</h4>

                                <FormField
                                    control={form.control}
                                    name="showHireMe"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t('show_hire_me')}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
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
