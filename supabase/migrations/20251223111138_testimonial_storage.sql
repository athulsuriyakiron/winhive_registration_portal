-- Create storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (safe approach)
DROP POLICY IF EXISTS "Public read access for testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial images" ON storage.objects;

-- Policy: Allow public read access to testimonial images
CREATE POLICY "Public read access for testimonial images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'testimonial-images');

-- Policy: Allow authenticated users to upload testimonial images
CREATE POLICY "Authenticated users can upload testimonial images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-images');

-- Policy: Allow authenticated users to update their own testimonial images
CREATE POLICY "Authenticated users can update testimonial images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonial-images');

-- Policy: Allow authenticated users to delete testimonial images
CREATE POLICY "Authenticated users can delete testimonial images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-images');