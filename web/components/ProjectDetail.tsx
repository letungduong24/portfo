"use client";

import { ExternalLink, Github, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/use-profile-store";
import { useProjectStore } from "@/store/use-project-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import NextImage from "next/image";

interface ProjectDetailProps {
    slug: string;
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
    const { isLoading: isProfileLoading, profile } = useProfileStore();
    const { selectedProject: project, fetchProjectBySlug, isLoading: isProjectLoading } = useProjectStore();
    const t = useTranslations('HomePage.ProjectDetail');
    const locale = useLocale();

    useEffect(() => {
        fetchProjectBySlug(slug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const isLoading = isProfileLoading || isProjectLoading;

    if (isLoading || !project) {
        return (
            <div className="min-h-screen w-full">
                <div className="container mx-auto px-4 py-10 md:py-20 max-w-4xl space-y-12">
                    {/* Hero Skeleton */}
                    <div className="space-y-6 border-b border-white/20 pb-12">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="space-y-12">
                        <Skeleton className="h-8 w-40 mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normalize data based on locale
    const title = locale === 'vi' ? project.titleVi : project.titleEn;
    const overview = locale === 'vi' ? project.overviewVi : project.overviewEn;
    const role = locale === 'vi' ? project.roleVi : project.roleEn;

    // Format date range
    const formatDate = (date: Date | string | null) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
    };
    const duration = project.startDate && project.endDate
        ? `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
        : project.startDate
            ? `${formatDate(project.startDate)} - ${locale === 'vi' ? 'Hiện tại' : 'Present'}`
            : '';

    const problem = locale === 'vi' ? project.problemVi : project.problemEn;
    const solution = locale === 'vi' ? project.solutionVi : project.solutionEn;
    const features = locale === 'vi' ? project.featuresVi : project.featuresEn;
    const learned = locale === 'vi' ? project.learnedVi : project.learnedEn;
    const architecture = locale === 'vi' ? project.architectureVi : project.architectureEn;

    // Complex fields need mapping if object structure differs or needs locale selection
    const techStack = project.techStack as any[]; // Assuming generic array type for now
    const challenges = project.challenges as any[];

    const demoCredentials = project.demoCredentials as any;
    const demoNote = demoCredentials ? (locale === 'vi' ? demoCredentials.noteVi : demoCredentials.noteEn) : null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen w-full">
            <div className="container mx-auto px-4 py-10 md:py-20 max-w-4xl">
                {/* Hero Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 border-b border-white/20 pb-12"
                >
                    <div className="mb-6 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                        {title}
                    </h1>

                    {project.thumbnailUrl && (
                        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                            <NextImage
                                src={project.thumbnailUrl}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <p className="mb-8 text-xl text-white/70">{overview}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                            <span className="block text-white/50">{t('role')}</span>
                            <span className="font-medium text-white">{role}</span>
                        </div>
                        {duration && <div>
                            <span className="block text-white/50">{t('duration')}</span>
                            <span className="font-medium text-white">{duration}</span>
                        </div>}
                        {project.links.demo && (
                            <div>
                                <span className="block text-white/50 mb-1">{t('demo')}</span>
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
                                >
                                    {t('live_preview')} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        {project.links.repo && (
                            <div>
                                <span className="block text-white/50 mb-1">{t('code')}</span>
                                <a
                                    href={project.links.repo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
                                >
                                    {t('view_code')} <Github className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </motion.header>

                {/* Main Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-16"
                >
                    {/* Problem */}
                    {problem.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('problem')}</h2>
                        <ul className="space-y-3">
                            {problem.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-white/70">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>}

                    {/* Solution */}
                    {solution.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('solution')}</h2>
                        <ul className="space-y-3">
                            {solution.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-white/70">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>}

                    {/* Main Features */}
                    {features.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('main_features')}</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/5 p-3 text-sm text-white">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </motion.section>}

                    {/* Tech Stack */}
                    {techStack.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('tech_stack')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {techStack.map((tech, idx) => (
                                <div key={idx} className="rounded-lg border border-white/20 bg-white/5 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-white">{tech.name}</span>
                                    </div>
                                    <p className="text-sm text-white/60">{locale === 'vi' ? tech.reasonVi : tech.reasonEn}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>}

                    {/* Architecture */}
                    {architecture && (
                        <motion.section variants={itemVariants}>
                            <h2 className="mb-6 text-2xl font-bold text-white">{t('architecture')}</h2>
                            <div className="rounded-xl border border-white/20 bg-white/5 p-6 font-mono text-sm text-white/70">
                                {architecture}
                            </div>
                        </motion.section>
                    )}

                    {/* Challenges */}
                    {challenges.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('challenges_decisions')}</h2>
                        <div className="space-y-6">
                            {challenges.map((challenge, idx) => (
                                <div key={idx} className="rounded-xl border border-white/20 bg-white/5 p-6">
                                    <h3 className="mb-2 font-semibold text-white">{t('challenge')} {idx + 1}</h3>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-[80px_1fr] gap-4">
                                            <span className="text-sm font-medium text-white">{t('problem')}</span>
                                            <p className="text-sm text-white/70">{locale === 'vi' ? challenge.problemVi : challenge.problemEn}</p>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-4">
                                            <span className="text-sm font-medium text-white">{t('solution')}</span>
                                            <p className="text-sm text-white/70">{locale === 'vi' ? challenge.solutionVi : challenge.solutionEn}</p>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-4">
                                            <span className="text-sm font-medium text-white">{t('reason')}</span>
                                            <p className="text-sm text-white/70">{locale === 'vi' ? challenge.reasonVi : challenge.reasonEn}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>}

                    {/* Learned */}
                    {learned.length > 0 && <motion.section variants={itemVariants}>
                        <h2 className="mb-6 text-2xl font-bold text-white">{t('what_i_learned')}</h2>
                        <ul className="space-y-3">
                            {learned.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-white/70">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>}

                    {/* Demo Account & Bottom Links */}
                    <motion.section
                        variants={itemVariants}
                        className={`pt-8 ${demoCredentials && (demoCredentials.email || demoCredentials.password) ? "border-t border-white/20" : ""}`}
                    >
                        {demoCredentials && (demoCredentials.email || demoCredentials.password) && (
                            <div className="mb-8 rounded-lg border border-white/20 bg-white/5 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-white">{t('demo_account')}</h3>
                                <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 max-w-2xl">
                                    {demoCredentials.email && (
                                        <div>
                                            <span className="text-sm text-muted-foreground block">{t('email')}</span>
                                            <code className="text-sm font-mono text-foreground">{demoCredentials.email}</code>
                                        </div>
                                    )}
                                    {demoCredentials.password && (
                                        <div>
                                            <span className="text-sm text-muted-foreground block">{t('password')}</span>
                                            <code className="text-sm font-mono text-foreground">{demoCredentials.password}</code>
                                        </div>
                                    )}
                                    {demoNote && (
                                        <div className="sm:col-span-2 mt-2">
                                            <span className="text-sm text-muted-foreground block">{t('note')}</span>
                                            <p className="text-sm text-foreground">{demoNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {project.links.demo && (
                                <Button asChild size="lg" className="w-full sm:w-auto">
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                                    </a>
                                </Button>
                            )}
                            {project.links.repo && (
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                                    <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-4 w-4" /> View Code
                                    </a>
                                </Button>
                            )}
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
}
