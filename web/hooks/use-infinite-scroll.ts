
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/axios';

interface UseInfiniteScrollOptions<T> {
    endpoint: string;
    limit?: number;
    initialData?: T[];
}

export function useInfiniteScroll<T>({ endpoint, limit = 10, initialData = [] }: UseInfiniteScrollOptions<T>) {
    const [data, setData] = useState<T[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const observer = useRef<IntersectionObserver | null>(null);

    // Reset pagination when search changes
    useEffect(() => {
        setPage(0);
        setData([]);
        setHasMore(true);
    }, [search]);

    const fetchData = useCallback(async () => {
        if (!hasMore && page > 0) return; // Don't fetch if no more data, unless it's the first load (which might be handled by effect)

        setIsLoading(true);
        try {
            const skip = page * limit;
            const res = await api.get(endpoint, {
                params: {
                    skip,
                    take: limit,
                    search: search || undefined
                }
            });

            const newData = res.data;
            if (newData.length < limit) {
                setHasMore(false);
            }

            setData(prev => page === 0 ? newData : [...prev, ...newData]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, limit, page, search, hasMore]);


    useEffect(() => {
        fetchData();
    }, [page, search]); // Re-fetch when page or search changes


    const lastElementRef = useCallback((node: Element | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    return { data, isLoading, hasMore, lastElementRef, handleSearch, search, setData };
}
