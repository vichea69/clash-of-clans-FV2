import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { baseApi } from '@/api/baseApi';

export const useBaseActions = (baseId?: string) => {
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const updateBase = async (formData: FormData) => {
        if (!isAuthenticated) {
            toast.error("You must be signed in to update a base");
            return false;
        }

        if (!baseId) {
            toast.error("No base ID provided");
            return false;
        }

        setIsLoading(true);

        try {
            const response = await baseApi.updateBase(Number(baseId), {
                name: formData.get('name') as string,
                link: formData.get('link') as string,
                image: formData.get('image') as File | undefined,
            });

            if (response.success) {
                toast.success("Base updated successfully");
                return true;
            } else {
                toast.error(response.message || "Failed to update base");
                return false;
            }
        } catch (error) {
            console.error("Error updating base:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update base");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBase = async () => {
        if (!isAuthenticated) {
            toast.error("You must be signed in to delete a base");
            return false;
        }

        if (!baseId) {
            toast.error("No base ID provided");
            return false;
        }

        setIsLoading(true);

        try {
            const response = await baseApi.deleteBase(Number(baseId));
            if (response.success) {
                toast.success("Base deleted successfully");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting base:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete base");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateBase,
        deleteBase,
        isLoading
    };
}; 