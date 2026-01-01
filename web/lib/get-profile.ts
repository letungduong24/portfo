import api from "./axios";

export async function getProfileForMetadata() {
    try {
        const res = await api.get('/profile');
        return res.data;
    } catch (error) {
        console.error("Failed to fetch profile for metadata", error);
        return null;
    }
}
