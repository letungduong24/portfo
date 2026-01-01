"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useAuthStore } from "@/store/use-auth-store"


export default function LoginPage() {
    const t = useTranslations("Login")
    const router = useRouter()
    const { login, isLoggingIn, isLoading, error, user, checkAuth } = useAuthStore()

    // Redirect if already logged in
    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/admin")
        }
    }, [isLoading, user, router])

    const formSchema = z.object({
        email: z.string().email({
            message: t("validation.email_invalid"),
        }),
        password: z.string().min(6, {
            message: t("validation.password_min"),
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await login(values)
            // Redirect is handled by useEffect
        } catch (err) {
            // Error is handled in store
        }
    }

    if (isLoading) return null // Or a spinner, waiting for checkAuth

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Card className="max-w-3xl w-full z-10 backdrop-blur-sm bg-white/80 dark:bg-black/80">
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("email_label")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("email_placeholder")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("password_label")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={t("password_placeholder")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-sm text-red-500">{t(error as any)}</p>}
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? t("logging_in") : t("submit_button")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
