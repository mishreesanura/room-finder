import { createClient } from "@/utils/supabase/client";

export interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

/**
 * Upload multiple images to Supabase Storage
 * @param files - Array of image files to upload
 * @param userId - Current user's ID for organizing files
 * @param onProgress - Optional callback for tracking upload progress
 * @returns Array of public URLs for uploaded images
 */
export async function uploadRoomImages(
  files: File[],
  userId: string,
  onProgress?: (progress: UploadProgress[]) => void
): Promise<string[]> {
  const supabase = createClient();
  const uploadedUrls: string[] = [];
  const progressMap: Map<string, UploadProgress> = new Map();

  // Initialize progress tracking
  files.forEach((file) => {
    progressMap.set(file.name, {
      file,
      progress: 0,
    });
  });

  // Upload each file
  for (const file of files) {
    try {
      // Update progress to uploading
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        progress: 50,
      });

      if (onProgress) {
        onProgress(Array.from(progressMap.values()));
      }

      // Generate unique file path: userId/timestamp_filename
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const fileName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, "_");
      const filePath = `${userId}/${timestamp}_${fileName}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("room-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        progressMap.set(file.name, {
          ...progressMap.get(file.name)!,
          progress: 100,
          error: error.message,
        });

        if (onProgress) {
          onProgress(Array.from(progressMap.values()));
        }
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("room-images")
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      uploadedUrls.push(publicUrl);

      // Update progress to complete
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        progress: 100,
        url: publicUrl,
      });

      if (onProgress) {
        onProgress(Array.from(progressMap.values()));
      }
    } catch (error) {
      console.error("Unexpected error uploading file:", error);
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        progress: 100,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      if (onProgress) {
        onProgress(Array.from(progressMap.values()));
      }
    }
  }

  return uploadedUrls;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Public URL of the image to delete
 * @returns Success boolean
 */
export async function deleteRoomImage(imageUrl: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Extract file path from public URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/room-images/");
    if (pathParts.length < 2) {
      console.error("Invalid image URL format");
      return false;
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from("room-images")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting file:", error);
    return false;
  }
}

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!validTypes.includes(file.type)) {
    return "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.";
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return "File size too large. Maximum size is 5MB.";
  }

  return null;
}
