/*
  # Initial PicSync schema setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `phone_number` (text)
      - `email` (text)
      - `hobbies` (text array)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `albums`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `emoji` (text)
      - `user_id` (uuid, foreign key to auth.users)
    - `photos`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `title` (text)
      - `description` (text, nullable)
      - `url` (text)
      - `album_id` (uuid, foreign key to albums)
      - `user_id` (uuid, foreign key to auth.users)
      - `is_public` (boolean)
      - `metadata` (jsonb, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for photos marked as public
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  hobbies TEXT[] NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NULL,
  url TEXT NOT NULL,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false NOT NULL,
  metadata JSONB NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for albums
CREATE POLICY "Users can view their own albums"
  ON albums
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own albums"
  ON albums
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own albums"
  ON albums
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own albums"
  ON albums
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for photos
CREATE POLICY "Users can view their own photos"
  ON photos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public photos"
  ON photos
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Users can create their own photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_public ON photos(is_public);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the profiles table to update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();