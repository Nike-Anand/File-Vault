/*
  # Create Storage Bucket for File Vault

  1. Storage Setup
    - Creates a new storage bucket named 'files' for storing user files
    - Enables Row Level Security (RLS) on the bucket
  
  2. Security
    - Adds policies for authenticated users to:
      - Upload files to their own directory
      - Download their own files
      - Delete their own files
    - Files are stored in user-specific folders using user ID
*/

-- Create a new storage bucket for files
INSERT INTO storage.buckets (id, name)
VALUES ('files', 'files')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);