"use client"

import { useEffect, useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useProfileStore } from "@/store/use-profile-store"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Upload } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ServicesManager } from "@/components/dashboard/services/ServicesManager"

export default function ProfilePage() {
    const { profile, fetchProfile, updateHero, updateSocialLinks, deleteSkillGroup, deleteSkill, isLoading, isUpdating } = useProfileStore()
    const [formData, setFormData] = useState<any>({})
    const [deletedGroupIds, setDeletedGroupIds] = useState<number[]>([])
    const [deletedSkillIds, setDeletedSkillIds] = useState<number[]>([])
    const [savingHero, setSavingHero] = useState(false)
    const [savingSocial, setSavingSocial] = useState(false)
    const t = useTranslations('Profile');
    const tErrors = useTranslations('errors');
    const tCommon = useTranslations('Common');



    useEffect(() => {
        if (profile) {
            setFormData(profile)
            setDeletedGroupIds([])
            setDeletedSkillIds([])
        }
    }, [profile])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev: any) => ({ ...prev, [id]: value }))
    }



    const handleSaveHero = async () => {
        if (profile?.id) {
            setSavingHero(true);
            try {
                await updateHero(profile.id, {
                    headlineVi: formData.headlineVi,
                    headlineEn: formData.headlineEn,
                    subheadlineVi: formData.subheadlineVi,
                    subheadlineEn: formData.subheadlineEn,
                    desc1Vi: formData.desc1Vi,
                    desc1En: formData.desc1En,
                });
                toast.success(t('toast.update_success'));
            } catch (err: any) {
                if (err.translationKey) {
                    const key = err.translationKey.replace('Common.', '');
                    toast.error(tCommon(key));
                } else if (!err.isHandled) {
                    const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                    toast.error(tErrors(code));
                }
            } finally {
                setSavingHero(false);
            }
        }
    }



    const handleSaveSocialLinks = async () => {
        if (profile?.id) {
            setSavingSocial(true);
            try {
                await updateSocialLinks(profile.id, {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    facebook: formData.facebook,
                    email: formData.email,
                });
                toast.success(t('toast.update_success'));
            } catch (err: any) {
                if (err.translationKey) {
                    const key = err.translationKey.replace('Common.', '');
                    toast.error(tCommon(key));
                } else if (!err.isHandled) {
                    const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                    toast.error(tErrors(code));
                }
            } finally {
                setSavingSocial(false);
            }
        }
    }

    const markGroupForDeletion = (groupId: number) => {
        setDeletedGroupIds(prev => [...prev, groupId]);
        // Also mark all skills in this group for deletion
        const group = formData.skillGroups?.find((g: any) => g.id === groupId);
        if (group?.skills) {
            const skillIds = group.skills.map((s: any) => s.id);
            setDeletedSkillIds(prev => [...prev, ...skillIds]);
        }
        // Remove from formData immediately for UI update
        setFormData((prev: any) => ({
            ...prev,
            skillGroups: prev.skillGroups?.filter((g: any) => g.id !== groupId)
        }));
    }

    const markSkillForDeletion = (skillId: number, groupId: number) => {
        setDeletedSkillIds(prev => [...prev, skillId]);
        // Remove from formData immediately for UI update
        setFormData((prev: any) => ({
            ...prev,
            skillGroups: prev.skillGroups?.map((g: any) =>
                g.id === groupId
                    ? { ...g, skills: g.skills?.filter((s: any) => s.id !== skillId) }
                    : g
            )
        }));
    }

    if (isLoading && !profile) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <div className="space-y-6">
                {/* Hero Sections via Tabs */}
                <Tabs defaultValue="vi" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vi" className="space-y-6 mt-4">
                        {/* Hero VI */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('sections.hero.title')} (Tiếng Việt)</CardTitle>
                                <CardDescription>{t('sections.hero.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headlineVi">{t('sections.hero.headline')} (VI)</Label>
                                    <Input id="headlineVi" value={formData.headlineVi || ''} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subheadlineVi">{t('sections.hero.subheadline')} (VI)</Label>
                                    <Input id="subheadlineVi" value={formData.subheadlineVi || ''} onChange={handleChange} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="desc1Vi">{t('sections.hero.desc1')} (VI)</Label>
                                    <Textarea id="desc1Vi" value={formData.desc1Vi || ''} onChange={handleChange} className="min-h-[100px]" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveHero} disabled={savingHero}>
                                        {savingHero && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('save')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="en" className="space-y-6 mt-4">
                        {/* Hero EN */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('sections.hero.title')} (English)</CardTitle>
                                <CardDescription>{t('sections.hero.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="headlineEn">{t('sections.hero.headline')} (EN)</Label>
                                    <Input id="headlineEn" value={formData.headlineEn || ''} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subheadlineEn">{t('sections.hero.subheadline')} (EN)</Label>
                                    <Input id="subheadlineEn" value={formData.subheadlineEn || ''} onChange={handleChange} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="desc1En">{t('sections.hero.desc1')} (EN)</Label>
                                    <Textarea id="desc1En" value={formData.desc1En || ''} onChange={handleChange} className="min-h-[100px]" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveHero} disabled={savingHero}>
                                        {savingHero && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('save')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <ServicesManager />

                {/* Social Links (Shared) */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('sections.social.title')}</CardTitle>
                        <CardDescription>{t('sections.social.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="github">{t('sections.social.github')}</Label>
                            <Input id="github" value={formData.github || ''} onChange={handleChange} placeholder="https://github.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">{t('sections.social.linkedin')}</Label>
                            <Input id="linkedin" value={formData.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebook">{t('sections.social.facebook')}</Label>
                            <Input id="facebook" value={formData.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('sections.social.email')}</Label>
                            <Input id="email" value={formData.email || ''} onChange={handleChange} placeholder="mailto:..." />
                        </div>
                        <div className="col-span-2 flex justify-end pt-4">
                            <Button onClick={handleSaveSocialLinks} disabled={savingSocial}>
                                {savingSocial && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('save')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <TechStackManager
                    formData={formData}
                    setFormData={setFormData}
                    onDeleteGroup={markGroupForDeletion}
                    onDeleteSkill={markSkillForDeletion}
                />
            </div>
        </div>
    )
}


interface TechStackManagerProps {
    formData: any;
    setFormData: (data: any) => void;
    onDeleteGroup: (groupId: number) => void;
    onDeleteSkill: (skillId: number, groupId: number) => void;
}

function TechStackManager({ formData, setFormData, onDeleteGroup, onDeleteSkill }: TechStackManagerProps) {
    const { addSkillGroup, updateSkillGroup, addSkill, updateSkill, deleteSkillGroup, deleteSkill, isUpdating } = useProfileStore();
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [isViewSkillsDialogOpen, setIsViewSkillsDialogOpen] = useState(false);
    const [deleteGroupAlertOpen, setDeleteGroupAlertOpen] = useState(false);
    const [deleteSkillAlertOpen, setDeleteSkillAlertOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any | null>(null);
    const [editingSkill, setEditingSkill] = useState<any | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [viewingGroup, setViewingGroup] = useState<any | null>(null);
    const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null);
    const [deletingSkillId, setDeletingSkillId] = useState<number | null>(null);
    const [deletingSkillGroupId, setDeletingSkillGroupId] = useState<number | null>(null);
    const [groupFormData, setGroupFormData] = useState({ nameVi: "", nameEn: "", icon: "" });
    const [skillFormData, setSkillFormData] = useState({ nameVi: "", nameEn: "", descriptionVi: "", descriptionEn: "", skillGroupId: 0 });
    const [isUploading, setIsUploading] = useState(false);
    const t = useTranslations('Profile');
    const tErrors = useTranslations('errors');
    const tCommon = useTranslations('Common');

    const handleViewSkills = (group: any) => {
        setViewingGroup(group);
        setIsViewSkillsDialogOpen(true);
    };

    const handleEditGroup = (item: any) => {
        setEditingGroup(item);
        setGroupFormData({
            nameVi: item.nameVi || "",
            nameEn: item.nameEn || "",
            icon: item.icon,
        });
        setIsGroupDialogOpen(true);
    };

    const handleDeleteGroup = (id: number) => {
        setDeletingGroupId(id);
        setDeleteGroupAlertOpen(true);
    };

    const confirmDeleteGroup = async () => {
        if (deletingGroupId) {
            try {
                await deleteSkillGroup(deletingGroupId);
                toast.success(t('toast.tech_deleted'));
                setDeleteGroupAlertOpen(false);
                setDeletingGroupId(null);
            } catch (err: any) {
                if (err.translationKey) {
                    const key = err.translationKey.replace('Common.', '');
                    toast.error(tCommon(key));
                } else if (!err.isHandled) {
                    const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                    toast.error(tErrors(code));
                }
            }
        }
    };

    const handleSubmitGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await updateSkillGroup(editingGroup.id, groupFormData);
                toast.success(t('toast.tech_updated'));
            } else {
                await addSkillGroup(groupFormData);
                toast.success(t('toast.tech_added'));
            }
            setIsGroupDialogOpen(false);
            setEditingGroup(null);
            setGroupFormData({ nameVi: "", nameEn: "", icon: "" });
        } catch (err: any) {
            if (err.translationKey) {
                const key = err.translationKey.replace('Common.', '');
                toast.error(tCommon(key));
            } else if (!err.isHandled) {
                const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                toast.error(tErrors(code));
            }
        }
    };

    const handleAddSkill = (groupId: number) => {
        setSelectedGroupId(groupId);
        setEditingSkill(null);
        setSkillFormData({ nameVi: "", nameEn: "", descriptionVi: "", descriptionEn: "", skillGroupId: groupId });
        setIsSkillDialogOpen(true);
    };

    const handleEditSkill = (skill: any) => {
        setEditingSkill(skill);
        setSkillFormData({
            nameVi: skill.nameVi || "",
            nameEn: skill.nameEn || "",
            descriptionVi: skill.descriptionVi || "",
            descriptionEn: skill.descriptionEn || "",
            skillGroupId: skill.skillGroupId
        });
        setIsSkillDialogOpen(true);
    };

    const handleDeleteSkill = (id: number, groupId: number) => {
        setDeletingSkillId(id);
        setDeletingSkillGroupId(groupId);
        setDeleteSkillAlertOpen(true);
    };

    const confirmDeleteSkill = async () => {
        if (deletingSkillId) {
            try {
                await deleteSkill(deletingSkillId);
                toast.success(t('toast.tech_deleted'));

                // Update viewingGroup if it's currently being viewed
                if (viewingGroup && deletingSkillGroupId && viewingGroup.id === deletingSkillGroupId) {
                    setViewingGroup({
                        ...viewingGroup,
                        skills: viewingGroup.skills.filter((skill: any) => skill.id !== deletingSkillId)
                    });
                }

                setDeleteSkillAlertOpen(false);
                setDeletingSkillId(null);
                setDeletingSkillGroupId(null);
            } catch (err: any) {
                if (err.translationKey) {
                    const key = err.translationKey.replace('Common.', '');
                    toast.error(tCommon(key));
                } else if (!err.isHandled) {
                    const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                    toast.error(tErrors(code));
                }
            }
        }
    };

    const handleSubmitSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSkill) {
                await updateSkill(editingSkill.id, skillFormData);
                toast.success(t('toast.tech_updated'));
            } else {
                await addSkill(skillFormData);
                toast.success(t('toast.tech_added'));
            }
            setIsSkillDialogOpen(false);
            setEditingSkill(null);
            setSkillFormData({ nameVi: "", nameEn: "", descriptionVi: "", descriptionEn: "", skillGroupId: 0 });
        } catch (err: any) {
            if (err.translationKey) {
                const key = err.translationKey.replace('Common.', '');
                toast.error(tCommon(key));
            } else if (!err.isHandled) {
                const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                toast.error(tErrors(code));
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const { uploadImage } = useProfileStore.getState();

        try {
            const url = await uploadImage(file);
            setGroupFormData(prev => ({ ...prev, icon: url }));
            toast.success(t('toast.image_uploaded'));
        } catch (err: any) {
            if (err.translationKey) {
                const key = err.translationKey.replace('Common.', '');
                toast.error(tCommon(key));
            } else if (!err.isHandled) {
                const code = err?.response?.data?.error?.code || 'UNKNOWN_ERROR';
                toast.error(tErrors(code));
            }
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b p-6">
                <div>
                    <CardTitle>{t('sections.skills.title')}</CardTitle>
                    <CardDescription>{t('sections.skills.description')}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {/* Add Skill Group Dialog */}
                    <Dialog open={isGroupDialogOpen} onOpenChange={(open) => {
                        setIsGroupDialogOpen(open);
                        if (!open) {
                            setEditingGroup(null);
                            setGroupFormData({ nameVi: "", nameEn: "", icon: "" });
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> {t('sections.skills.add_group')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingGroup ? t('sections.skills.edit_group') : t('sections.skills.add_group')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitGroup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="group-icon">{t('upload_icon')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="group-icon"
                                            value={groupFormData.icon}
                                            onChange={(e) => setGroupFormData({ ...groupFormData, icon: e.target.value })}
                                            placeholder="/logo/frontend.svg"
                                            required
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="upload-group-icon"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".svg,image/svg+xml,image/*"
                                                onChange={handleFileUpload}
                                                disabled={isUpdating || isUploading}
                                            />
                                            <Button type="button" variant="outline" size="icon" disabled={isUpdating || isUploading}>
                                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Tabs defaultValue="vi" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                                        <TabsTrigger value="en">English</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="vi" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="group-nameVi">{t('sections.skills.name')} (VI)</Label>
                                            <Input
                                                id="group-nameVi"
                                                value={groupFormData.nameVi}
                                                onChange={(e) => setGroupFormData({ ...groupFormData, nameVi: e.target.value })}
                                                placeholder="Frontend"
                                                required
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="en" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="group-nameEn">{t('sections.skills.name')} (EN)</Label>
                                            <Input
                                                id="group-nameEn"
                                                value={groupFormData.nameEn}
                                                onChange={(e) => setGroupFormData({ ...groupFormData, nameEn: e.target.value })}
                                                placeholder="Frontend"
                                                required
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <DialogFooter>
                                    <Button type="submit" disabled={isUpdating || isUploading}>
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('save')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Add/Edit Skill Dialog */}
                    <Dialog open={isSkillDialogOpen} onOpenChange={(open) => {
                        setIsSkillDialogOpen(open);
                        if (!open) {
                            setEditingSkill(null);
                            setSkillFormData({ nameVi: "", nameEn: "", descriptionVi: "", descriptionEn: "", skillGroupId: 0 });
                        }
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingSkill ? t('sections.skills.edit_skill') : t('sections.skills.add_skill')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitSkill} className="space-y-4">
                                <Tabs defaultValue="vi" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                                        <TabsTrigger value="en">English</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="vi" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="skill-nameVi">Tên Skill (VI)</Label>
                                            <Input
                                                id="skill-nameVi"
                                                value={skillFormData.nameVi}
                                                onChange={(e) => setSkillFormData({ ...skillFormData, nameVi: e.target.value })}
                                                placeholder="Next.js 16"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="skill-descVi">Mô tả (VI)</Label>
                                            <Input
                                                id="skill-descVi"
                                                value={skillFormData.descriptionVi}
                                                onChange={(e) => setSkillFormData({ ...skillFormData, descriptionVi: e.target.value })}
                                                placeholder="Framework"
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="en" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="skill-nameEn">Skill Name (EN)</Label>
                                            <Input
                                                id="skill-nameEn"
                                                value={skillFormData.nameEn}
                                                onChange={(e) => setSkillFormData({ ...skillFormData, nameEn: e.target.value })}
                                                placeholder="Next.js 16"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="skill-descEn">Description (EN)</Label>
                                            <Input
                                                id="skill-descEn"
                                                value={skillFormData.descriptionEn}
                                                onChange={(e) => setSkillFormData({ ...skillFormData, descriptionEn: e.target.value })}
                                                placeholder="Framework"
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <DialogFooter>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('save')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.skillGroups?.map((group: any) => (
                        <div
                            key={group.id}
                            className="group rounded-lg border bg-card p-4 transition-all hover:border-foreground/30 hover:shadow-md cursor-pointer"
                            onClick={() => handleViewSkills(group)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <img src={group.icon} alt={group.nameVi} className="h-6 w-6 object-contain" onError={(e) => e.currentTarget.src = "https://placehold.co/32?text=?"} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-sm font-semibold">{group.nameVi}</h4>
                                    <p className="truncate text-xs text-muted-foreground">{group.skills?.length || 0} skills</p>
                                </div>
                                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddSkill(group.id)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditGroup(group)}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteGroup(group.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {(!formData?.skillGroups || formData.skillGroups.length === 0) && (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                        {t('sections.skills.empty')}
                    </div>
                )}

                {/* View Skills Dialog */}
                <Dialog open={isViewSkillsDialogOpen} onOpenChange={setIsViewSkillsDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                                {viewingGroup?.icon && (
                                    <img src={viewingGroup.icon} alt={viewingGroup.nameVi} className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.src = "https://placehold.co/32?text=?"} />
                                )}
                                {viewingGroup?.nameVi}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 mt-4">
                            {viewingGroup?.skills && viewingGroup.skills.length > 0 ? (
                                viewingGroup.skills.map((skill: any) => (
                                    <div key={skill.id} className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{skill.nameVi}</p>
                                            {skill.descriptionVi && (
                                                <p className="text-xs text-muted-foreground mt-1">{skill.descriptionVi}</p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 gap-1 ml-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { handleEditSkill(skill); setIsViewSkillsDialogOpen(false); }}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteSkill(skill.id, viewingGroup.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No skills in this group yet</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Group Alert Dialog */}
                <AlertDialog open={deleteGroupAlertOpen} onOpenChange={setDeleteGroupAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xóa nhóm kỹ năng?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Nhóm kỹ năng và tất cả kỹ năng bên trong sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteGroup} className="bg-destructive hover:bg-destructive/90">
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Delete Skill Alert Dialog */}
                <AlertDialog open={deleteSkillAlertOpen} onOpenChange={setDeleteSkillAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xóa kỹ năng?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Kỹ năng sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteSkill} className="bg-destructive hover:bg-destructive/90">
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
