"use client";

import { useServiceStore } from "@/store/use-service-store";
import { useProfileStore } from "@/store/use-profile-store";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Briefcase, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

export function ServicesManager() {
    const { profile, isLoading, fetchProfile } = useProfileStore();
    const services = profile?.services || [];
    const { createService, updateService, deleteService } = useServiceStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [editingService, setEditingService] = useState<any | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);



    // Default form data
    const defaultFormData = {
        titleVi: "",
        titleEn: "",
        descriptionVi: "",
        descriptionEn: "",
        icon: "",
    };
    const [formData, setFormData] = useState(defaultFormData);

    const t = useTranslations('Admin.Services');
    // We might need to add 'Services' to translation files or reuse existing structure. 
    // Assuming 'Services' key is added or we use 'Admin.Services'

    const handleEdit = (service: any) => {
        setEditingService(service);
        setFormData({
            titleVi: service.titleVi,
            titleEn: service.titleEn,
            descriptionVi: service.descriptionVi,
            descriptionEn: service.descriptionEn,
            icon: service.icon,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingService(null);
        setFormData(defaultFormData);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
        setIsAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteService(deletingId);
            await fetchProfile(); // Refresh profile to get updated services
            toast.success("Service deleted successfully");
            setIsAlertOpen(false);
            setDeletingId(null);
        } catch (error) {
            toast.error("Failed to delete service");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            if (editingService) {
                await updateService(editingService.id, formData);
                toast.success("Service updated successfully");
            } else {
                await createService(formData);
                toast.success("Service created successfully");
            }
            await fetchProfile(); // Refresh profile to get updated services
            setIsDialogOpen(false);
            setFormData(defaultFormData);
            setEditingService(null);
        } catch (error) {
            toast.error(editingService ? "Failed to update service" : "Failed to create service");
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const { uploadImage } = useProfileStore.getState();

        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, icon: url }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    // Helper to render icon dynamically for preview (optional)
    const renderIcon = (iconName: string) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName];
        return Icon ? <Icon className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b p-6">
                <div>
                    <CardTitle>Services Management</CardTitle>
                    <CardDescription>Manage your "What I can do" section services.</CardDescription>
                </div>
                <Button size="sm" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </CardHeader>
            <CardContent className="p-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <div key={service.id} className="flex flex-col justify-between rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4 space-y-2">
                                    {service.icon && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-primary/10 text-primary">
                                                {renderIcon(service.icon)}
                                            </div>
                                            <span className="font-semibold text-sm">{service.icon}</span>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <div>
                                            <span className="text-xs font-bold text-muted-foreground uppercase">Vietnamese</span>
                                            <p className="font-medium text-sm line-clamp-1">{service.titleVi}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-muted-foreground uppercase">English</span>
                                            <p className="font-medium text-sm line-clamp-1">{service.titleEn}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 border-t pt-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                                        <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(service.id)}>
                                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {services.length === 0 && (
                            <div className="col-span-full py-8 text-center text-muted-foreground">
                                No services found. Add one to get started.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Tabs defaultValue="lucide" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="lucide">Lucide Icon</TabsTrigger>
                                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                            </TabsList>

                            <TabsContent value="lucide" className="space-y-2 mt-4">
                                <Label htmlFor="icon-lucide">Lucide Icon Name</Label>
                                <div className="flex gap-2 items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                                        {renderIcon(formData.icon)}
                                    </div>
                                    <Input
                                        id="icon-lucide"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="e.g. Palette, Code, Database... (optional)"
                                        className="flex-1"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter icon name from <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline">lucide.dev</a>
                                </p>
                            </TabsContent>

                            <TabsContent value="upload" className="space-y-2 mt-4">
                                <Label htmlFor="icon-upload">Upload Icon</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="icon-upload"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="/uploads/icon.svg (optional)"
                                        className="flex-1"
                                    />
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="upload-service-icon"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".svg,image/svg+xml,image/*"
                                            onChange={handleFileUpload}
                                            disabled={isSubmitLoading || isUploading}
                                        />
                                        <Button type="button" variant="outline" size="icon" disabled={isSubmitLoading || isUploading}>
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                            </TabsList>
                            <TabsContent value="en" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titleEn">Title (English)</Label>
                                    <Input
                                        id="titleEn"
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        placeholder="e.g. Web Development"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descEn">Description (English)</Label>
                                    <Textarea
                                        id="descEn"
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                        placeholder="Brief description of the service..."
                                        required
                                        className="resize-none"
                                        rows={4}
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="vi" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titleVi">Title (Vietnamese)</Label>
                                    <Input
                                        id="titleVi"
                                        value={formData.titleVi}
                                        onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                                        placeholder="e.g. Phát triển Website"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descVi">Description (Vietnamese)</Label>
                                    <Textarea
                                        id="descVi"
                                        value={formData.descriptionVi}
                                        onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                                        placeholder="Mô tả ngắn về dịch vụ..."
                                        required
                                        className="resize-none"
                                        rows={4}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitLoading}>
                                {isSubmitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingService ? "Update Service" : "Create Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
