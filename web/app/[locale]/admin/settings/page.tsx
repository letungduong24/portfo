"use client"

import { useProfileStore } from "@/store/use-profile-store"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Save, CircleHelp } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function PageSettings() {
    const t = useTranslations('Profile')
    const { profile, updateProfile, uploadImage, isLoading, fetchProfile } = useProfileStore()
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Local state for form
    const [formData, setFormData] = useState({
        pageTitle: "",
        pageDescription: "",
        pageIcon: "",
    })



    useEffect(() => {
        if (profile) {
            setFormData({
                pageTitle: profile.pageTitle || "",
                pageDescription: profile.pageDescription || "",
                pageIcon: profile.pageIcon || "",
            })
        }
    }, [profile])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const url = await uploadImage(file)
            setFormData(prev => ({
                ...prev,
                pageIcon: url
            }))
            toast.success(t('toast.image_uploaded'))
        } catch (error: any) {
            console.error(error)
            if (!error.isHandled) {
                toast.error("Failed to upload image")
            }
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return

        setIsSaving(true)
        try {
            await updateProfile(profile.id, formData)
            toast.success(t('toast.update_success'))
        } catch (error: any) {
            console.error(error)
            if (!error.isHandled) {
                toast.error("Failed to update profile")
            }
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('sections.page_settings.title')}</h2>
                <p className="text-muted-foreground">
                    {t('sections.page_settings.description')}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('sections.page_settings.general_title')}</CardTitle>
                        <CardDescription>
                            {t('sections.page_settings.general_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pageTitle">{t('sections.page_settings.page_title')}</Label>
                            <Input
                                id="pageTitle"
                                name="pageTitle"
                                value={formData.pageTitle}
                                onChange={handleInputChange}
                                placeholder="e.g. My Portfolio"
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CircleHelp className="h-3 w-3" />
                                {t('sections.page_settings.page_title_help')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pageDescription">{t('sections.page_settings.page_description')}</Label>
                            <Textarea
                                id="pageDescription"
                                name="pageDescription"
                                value={formData.pageDescription}
                                onChange={handleInputChange}
                                placeholder="e.g. A showcase of my work..."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CircleHelp className="h-3 w-3" />
                                {t('sections.page_settings.page_description_help')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('sections.page_settings.page_icon')}</Label>
                            <div className="flex items-center gap-4">
                                {formData.pageIcon && (
                                    <div className="relative h-16 w-16 border rounded-md overflow-hidden">
                                        <Image
                                            src={formData.pageIcon}
                                            alt="Page Icon"
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Label htmlFor="page-icon-upload" className="cursor-pointer">
                                        <div className="flex items-center gap-2 rounded-md border border-dashed p-3 hover:bg-accent transition-colors">
                                            {isUploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Upload className="h-4 w-4" />
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {isUploading ? t('toast.uploading_image') : t('upload_icon')}
                                            </span>
                                        </div>
                                        <Input
                                            id="page-icon-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                    </Label>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CircleHelp className="h-3 w-3" />
                                {t('sections.page_settings.page_icon_help')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isSaving || isUploading}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save')}
                    </Button>
                </div>
            </form>
        </div>
    )
}
