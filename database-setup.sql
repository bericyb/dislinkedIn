-- DislinkedIn Database Setup
-- Run this in your Supabase SQL Editor

-- Create post_dislikes table with user_id
CREATE TABLE IF NOT EXISTS post_dislikes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_urn TEXT NOT NULL,
    dislike_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_urn)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_dislikes_user_id ON post_dislikes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_dislikes_post_urn ON post_dislikes(post_urn);

-- Enable Row Level Security
ALTER TABLE post_dislikes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own dislikes" ON post_dislikes;
DROP POLICY IF EXISTS "Users can insert their own dislikes" ON post_dislikes;
DROP POLICY IF EXISTS "Users can update their own dislikes" ON post_dislikes;
DROP POLICY IF EXISTS "Users can delete their own dislikes" ON post_dislikes;

-- RLS Policies: Users can only see and manage their own dislikes
CREATE POLICY "Users can view their own dislikes"
    ON post_dislikes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dislikes"
    ON post_dislikes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dislikes"
    ON post_dislikes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dislikes"
    ON post_dislikes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_post_dislikes_updated_at ON post_dislikes;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_post_dislikes_updated_at
    BEFORE UPDATE ON post_dislikes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for aggregate statistics per user
CREATE OR REPLACE VIEW user_dislike_stats AS
SELECT
    user_id,
    COUNT(*) as total_posts_disliked,
    SUM(dislike_count) as total_dislikes
FROM post_dislikes
GROUP BY user_id;
