import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { baseApi } from '@/api/baseApi';


export interface BaseFormData {
  name: string;
  link: string;
  image?: File;
}

export const useBaseUpload = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const uploadBase = async (formData: BaseFormData) => {
    if (!isAuthenticated) {
      toast.error("You must be signed in to upload a base");
      return false;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('link', formData.link);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await baseApi.createBase(submitData);

      if (response.success) {
        toast.success("Base uploaded successfully");
        return true;
      }

      toast.error(response.message || "Failed to upload base");
      return false;
    } catch (error) {
      console.error("Error uploading base:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload base");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadBase,
    isLoading,
    userId: user?.id
  };
}; 