'use client';

import BlogEditor from '@/components/admin/BlogEditor';
import { use } from 'react';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <BlogEditor blogId={parseInt(id)} />;
}
