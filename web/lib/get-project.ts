import axios from "axios";

export async function getProjectBySlug(slug: string) {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${baseURL}/projects/${slug}`);
        return response.data;
    } catch (error) {
        return null;
    }
}
