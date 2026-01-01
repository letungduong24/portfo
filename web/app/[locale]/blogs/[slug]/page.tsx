import BlogDetail from "@/components/BlogDetail";
import { getBlogBySlug } from "@/lib/get-blog";
import { Metadata } from "next";

interface BlogPageProps {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Blog Not Found',
        };
    }

    const title = locale === 'vi' ? blog.titleVi : (blog.titleEn || blog.titleVi);
    const description = locale === 'vi' ? blog.titleVi : (blog.titleEn || blog.titleVi); // Using title as fallback description

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: blog.thumbnail ? [blog.thumbnail] : [],
        }
    };
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { slug } = await params;

    return <BlogDetail slug={slug} />;
}
