/*
  # Set up storage for photos

  1. Storage
    - Create photos bucket
    - Set up storage policies for authenticated users
    
  2. Security
    - Enable policies for authenticated users to manage their photos
    - Ensure public access for shared photos
*/

-- Create a new storage bucket for photos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true);

-- Allow authenticated users to upload files to the photos bucket
create policy "Users can upload photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own photos
create policy "Users can update their own photos"
on storage.objects for update to authenticated
using (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own photos
create policy "Users can delete their own photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to photos marked as public
create policy "Public photos are viewable by everyone"
on storage.objects for select
using (
  bucket_id = 'photos' AND
  exists (
    select 1 from public.photos
    where url like '%' || storage.objects.name || '%'
    and is_public = true
  )
);

-- Allow authenticated users to view their own photos
create policy "Users can view their own photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);