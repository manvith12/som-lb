-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  reputation INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create reputation_history table to track all changes
CREATE TABLE IF NOT EXISTS reputation_history (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_members_reputation ON members(reputation DESC);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_reputation_history_member_id ON reputation_history(member_id);
CREATE INDEX IF NOT EXISTS idx_reputation_history_created_at ON reputation_history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to members" ON members
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to reputation_history" ON reputation_history
  FOR SELECT
  USING (true);

-- Create policies for service role (for API endpoints with service key)
CREATE POLICY "Allow service role to insert members" ON members
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow service role to update members" ON members
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow service role to insert reputation_history" ON reputation_history
  FOR INSERT
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before update
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to add reputation points
CREATE OR REPLACE FUNCTION add_reputation(
  p_name TEXT,
  p_points INTEGER,
  p_reason TEXT,
  p_category TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_reputation INTEGER) AS $$
DECLARE
  v_member_id BIGINT;
  v_new_reputation INTEGER;
BEGIN
  -- Get or create member
  INSERT INTO members (name, reputation)
  VALUES (p_name, 0)
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_member_id;

  IF v_member_id IS NULL THEN
    SELECT id INTO v_member_id FROM members WHERE name = p_name;
  END IF;

  -- Update reputation
  UPDATE members
  SET reputation = reputation + p_points
  WHERE id = v_member_id
  RETURNING reputation INTO v_new_reputation;

  -- Record in history
  INSERT INTO reputation_history (member_id, points, reason, category)
  VALUES (v_member_id, p_points, p_reason, p_category);

  RETURN QUERY SELECT true, 'Reputation updated successfully', v_new_reputation;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, SQLERRM, 0;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data (optional - uncomment if needed)
-- INSERT INTO members (name, reputation, github_username) VALUES
--   ('Alice', 1000, 'alice'),
--   ('Bob', 850, 'bob'),
--   ('Charlie', 750, 'charlie');
