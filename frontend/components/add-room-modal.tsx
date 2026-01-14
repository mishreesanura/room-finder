"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import {
  uploadRoomImages,
  validateImageFile,
  deleteRoomImage,
  type UploadProgress,
} from "@/lib/upload";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

export function AddRoomModal({ isOpen, onClose, property }: AddRoomModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(
    property?.images || []
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: property?.title || "",
    location: property?.location || "",
    price: property?.rent?.replace("₹", "").replace(",", "") || "",
    propertyType: property?.propertyType || "",
    tenantPreference: property?.tenantPreference || "",
    contact: property?.contact || "",
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFileUpload(files);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // Initialize progress tracking before setting uploading state
    const initialProgress = validFiles.map((file) => ({
      file,
      progress: 0,
    }));
    setUploadProgress(initialProgress);
    setUploading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload images");
        setUploading(false);
        return;
      }

      // Upload images
      const urls = await uploadRoomImages(validFiles, user.id, (progress) => {
        setUploadProgress(progress);
      });

      // Add successful uploads to state
      if (urls.length > 0) {
        setUploadedImageUrls((prev) => [...prev, ...urls]);
        toast.success(`Successfully uploaded ${urls.length} image(s)`);
      }

      // Check for failed uploads in the returned progress
      if (urls.length < validFiles.length) {
        toast.error(
          `Failed to upload ${validFiles.length - urls.length} image(s)`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        "Failed to upload images: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = uploadedImageUrls[index];

    // Only attempt to delete from storage if it's a Supabase URL
    if (imageUrl && imageUrl.includes("supabase")) {
      const deleted = await deleteRoomImage(imageUrl);
      if (!deleted) {
        toast.error("Failed to delete image from storage");
      }
    }

    setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data
      if (!formData.title || !formData.location || !formData.price) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!formData.propertyType) {
        toast.error("Please select a property type");
        return;
      }

      if (!formData.tenantPreference) {
        toast.error("Please select a tenant preference");
        return;
      }

      if (uploadedImageUrls.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add a room");
        router.push("/login");
        return;
      }

      // Insert room into database
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          title: formData.title,
          location: formData.location,
          price: parseFloat(formData.price),
          property_type: formData.propertyType,
          tenant_preference: formData.tenantPreference,
          contact_number: formData.contact || null,
          image_urls: uploadedImageUrls,
          owner_id: user.id,
        })
        .select();

      if (error) {
        console.error("Insert error:", error);
        toast.error("Failed to add room: " + error.message);
        return;
      }

      toast.success("Room added successfully!");
      onClose();

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {property ? "Edit Room" : "Add New Room"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload Section */}
          <div>
            <Label className="text-base font-semibold text-foreground mb-3 block">
              Upload Images
            </Label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-secondary/30"
              } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept="image/*"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Uploading images...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {
                          uploadProgress.filter((p) => p.progress === 100)
                            .length
                        }{" "}
                        / {uploadProgress.length} complete
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Drag and drop images here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to select files (max 5MB each,
                        JPEG/PNG/WebP/GIF)
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {uploadedImageUrls.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 rounded-lg object-cover border border-border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="font-semibold text-foreground">
                Room Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Spacious 2 BHK in Ghatkopar"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-2 bg-input border-border"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="location"
                className="font-semibold text-foreground"
              >
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Ghatkopar, Mumbai"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="mt-2 bg-input border-border"
                required
              />
            </div>
          </div>

          {/* Rent Price */}
          <div>
            <Label htmlFor="rent" className="font-semibold text-foreground">
              Rent Price (₹/month)
            </Label>
            <Input
              id="rent"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g., 18000"
              value={formData.price}
              onChange={(e) => {
                // Only allow numeric input
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, price: value });
              }}
              className="mt-2 bg-input border-border"
              required
              min="0"
            />
          </div>

          {/* Property Type */}
          <div>
            <Label
              htmlFor="property-type"
              className="font-semibold text-foreground"
            >
              Property Type
            </Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setFormData({ ...formData, propertyType: value })
              }
            >
              <SelectTrigger className="mt-2 bg-input border-border">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 BHK">1 BHK</SelectItem>
                <SelectItem value="2 BHK">2 BHK</SelectItem>
                <SelectItem value="3 BHK">3 BHK</SelectItem>
                <SelectItem value="1 Bed">1 Bed</SelectItem>
                <SelectItem value="2 Bed">2 Bed</SelectItem>
                <SelectItem value="3 Bed">3 Bed</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tenant Preference */}
          <div>
            <Label
              htmlFor="tenant-pref"
              className="font-semibold text-foreground"
            >
              Tenant Preference
            </Label>
            <Select
              value={formData.tenantPreference}
              onValueChange={(value) =>
                setFormData({ ...formData, tenantPreference: value })
              }
            >
              <SelectTrigger className="mt-2 bg-input border-border">
                <SelectValue placeholder="Select tenant preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Girls">Girls</SelectItem>
                <SelectItem value="Working">Working Professionals</SelectItem>
                <SelectItem value="Any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contact" className="font-semibold text-foreground">
              Contact Number
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="e.g., +91 98765 43210"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              className="mt-2 bg-input border-border"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-secondary bg-transparent"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={uploading || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : property ? (
                "Update Room"
              ) : (
                "Add Room"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
