
import { Blog } from "@/store/use-blog-store";

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, {
            cache: 'no-store', // Ensure fresh data
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch blog by slug:", error);
        return null;
    }
}
