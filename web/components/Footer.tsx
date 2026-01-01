"use client";

import { Facebook, Github, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useProfileStore } from "@/store/use-profile-store";

export default function Footer() {
    const t = useTranslations('Footer');
    const locale = useLocale();
    const { profile } = useProfileStore();

    const footerTitle = (locale === 'vi' ? profile?.footerTitleVi : profile?.footerTitleEn) || t('portfolio');
    const copyrightName = (locale === 'vi' ? profile?.copyrightNameVi : profile?.copyrightNameEn) || "Le Tung Duong";

    // Contact logic
    const useProfile = profile?.footerUseProfileContact ?? true;
    const email = useProfile ? profile?.email : profile?.footerEmail;
    const github = useProfile ? profile?.github : profile?.footerGithub;
    const facebook = useProfile ? profile?.facebook : profile?.footerFacebook;
    const linkedin = useProfile ? profile?.linkedin : profile?.footerLinkedin;

    return (
        <footer className="w-full mt-auto pt-12">
            <div className="max-w-5xl p-3 md:p-6 border-t border-white/20 container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 text-center md:text-left">
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-foreground">{footerTitle}</span>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {copyrightName}. {t('rights')}.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                    <div className="flex items-center gap-4">
                        {email && (
                            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </a>
                        )}
                        {github && (
                            <Link href={github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        )}
                        {facebook && (
                            <Link href={facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        )}
                        {linkedin && (
                            <Link href={linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
