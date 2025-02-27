import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

// Define a generic response type to handle common API response patterns


export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export interface FetchOptions {
    requireAuth?: boolean;
    headers?: Record<string, string>;
    immediate?: boolean;
}

export function useFetch<T>(url: string, options: FetchOptions = {}) {
    const { isAuthenticated, } = useAuth();
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const fetchData = useCallback(async () => {
        // Check authentication requirement
        if (options.requireAuth && !isAuthenticated) {
            setState(prev => ({
                ...prev,
                error: new Error('Authentication required'),
                loading: false,
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Prepare headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            // Add auth token if available



            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setState({
                data: data.data || data, // Handle both { data: T } and T responses
                loading: false,
                error: null,
            });
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error : new Error('An error occurred'),
            });
        }
    }, [url, options.requireAuth, isAuthenticated, options.headers]);

    // Initial fetch if immediate is not false
    useEffect(() => {
        if (options.immediate !== false) {
            fetchData();
        }
    }, [fetchData, options.immediate]);

    return {
        ...state,
        refetch: fetchData,
    };
}

export default useFetch; 