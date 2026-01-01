import ProjectDetail from "@/components/ProjectDetail";
import { getProjectBySlug } from "@/lib/get-project";
import { Metadata } from "next";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    const title = locale === 'vi' ? project.titleVi : project.titleEn;
    const description = locale === 'vi' ? project.descriptionVi : project.descriptionEn;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
        }
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    return <ProjectDetail slug={slug} />;
}
