"use client";

import { useState, type ChangeEvent, type FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useBaseUpload } from "@/hooks/useBaseUpload";
import type { BaseFormData } from "@/hooks/useBaseUpload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BaseUploadProps {
  onSuccess?: () => void;
}

const BaseUpload = ({ onSuccess }: BaseUploadProps) => {
  const { uploadBase, isLoading } = useBaseUpload();
  const [formData, setFormData] = useState<BaseFormData>({
    name: "",
    link: "",
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((file: File) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageChange(file);
      }
    },
    [handleImageChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleImageChange(file);
      }
    },
    [handleImageChange]
  );

  const clearImage = useCallback(() => {
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      image: undefined,
    }));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const success = await uploadBase(formData);
      if (success) {
        toast.success("Base uploaded successfully");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error uploading base:", error);
      toast.error("Failed to upload base");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Base</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Base Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter base name"
                className="transition-all duration-200 focus:ring-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Base Link</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/base"
                className="transition-all duration-200 focus:ring-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Base Image</Label>
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border",
                    imagePreview ? "border-success/50" : ""
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    required={!formData.image}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileInputChange}
                  />
                  {imagePreview ? (
                    <div className="relative aspect-video max-w-sm mx-auto">
                      <img
                        src={imagePreview}
                        alt="Base preview"
                        className="object-contain rounded-lg w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="pointer-events-none">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop an image, or click to select
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Max file size: 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Base"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseUpload;
