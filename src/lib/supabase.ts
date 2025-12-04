import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if URL is a valid HTTP/HTTPS URL (not a placeholder)
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Create a mock client that returns empty results when Supabase is not configured
const createMockClient = () => {
  const mockResponse = { data: null, error: { message: 'Supabase not configured' } };
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => mockQuery(),
    update: () => mockQuery(),
    delete: () => mockQuery(),
    eq: () => mockQuery(),
    or: () => mockQuery(),
    order: () => mockQuery(),
    single: () => Promise.resolve(mockResponse),
    then: (resolve: (value: typeof mockResponse) => void) => Promise.resolve(mockResponse).then(resolve),
  });

  return {
    from: () => mockQuery(),
  } as unknown as SupabaseClient;
};

// Only create real client if URL is valid and key is provided
const isConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey;

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockClient();

export const isSupabaseConfigured = isConfigured;

// Database types
export interface Database {
  public: {
    Tables: {
      avatars: {
        Row: {
          id: string;
          name: string;
          user_id: string | null;
          business_info: Record<string, unknown>;
          avatar_data: Record<string, unknown>;
          industry: string;
          tags: string[];
          is_template: boolean;
          generation_mode: string;
          overall_confidence: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          user_id?: string | null;
          business_info: Record<string, unknown>;
          avatar_data: Record<string, unknown>;
          industry: string;
          tags?: string[];
          is_template?: boolean;
          generation_mode: string;
          overall_confidence: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string | null;
          business_info?: Record<string, unknown>;
          avatar_data?: Record<string, unknown>;
          industry?: string;
          tags?: string[];
          is_template?: boolean;
          generation_mode?: string;
          overall_confidence?: number;
          updated_at?: string;
        };
      };
      research_cache: {
        Row: {
          id: string;
          query_hash: string;
          research_data: Record<string, unknown>;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          query_hash: string;
          research_data: Record<string, unknown>;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          research_data?: Record<string, unknown>;
          expires_at?: string;
        };
      };
    };
  };
}

// SQL Schema for Supabase (run this in the SQL editor)
export const databaseSchema = `
-- Avatars table
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_info JSONB NOT NULL,
  avatar_data JSONB NOT NULL,
  industry VARCHAR(255) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_template BOOLEAN DEFAULT FALSE,
  generation_mode VARCHAR(50) NOT NULL,
  overall_confidence DECIMAL(3, 2) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research cache table
CREATE TABLE IF NOT EXISTS research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash VARCHAR(64) UNIQUE NOT NULL,
  research_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_avatars_industry ON avatars(industry);
CREATE INDEX IF NOT EXISTS idx_avatars_is_template ON avatars(is_template);
CREATE INDEX IF NOT EXISTS idx_avatars_tags ON avatars USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_research_cache_hash ON research_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_research_cache_expires ON research_cache(expires_at);

-- Row Level Security
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your auth requirements)
CREATE POLICY "Users can view their own avatars" ON avatars
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own avatars" ON avatars
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own avatars" ON avatars
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own avatars" ON avatars
  FOR DELETE USING (auth.uid() = user_id);

-- Templates are viewable by everyone
CREATE POLICY "Templates are public" ON avatars
  FOR SELECT USING (is_template = TRUE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_avatars_updated_at
  BEFORE UPDATE ON avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired cache entries (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM research_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
`;
