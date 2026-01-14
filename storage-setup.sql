-- ============================================
-- Supabase Storage Setup for Room Images
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- 1. Create the 'room-images' storage bucket
-- Note: You can also create this via the Supabase Dashboard UI
-- Storage > Create new bucket > name: "room-images", public: true

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload room images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for room images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own room images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own room images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- 3. Create simple storage policies

-- Allow ANY authenticated user to upload to room-images bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'room-images');

-- Allow public read access to all images in room-images bucket
CREATE POLICY "Allow public downloads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'room-images');

-- Allow authenticated users to update images in room-images bucket
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'room-images');

-- Allow authenticated users to delete images in room-images bucket
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'room-images');


