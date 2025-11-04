# Supabase Configuration Checklist

## Steps to Complete on Supabase Dashboard

Visit: https://pyaheqkbmytxbbksuakp.supabase.co

### 1. Run SQL Setup Script ✅

1. **Navigate to**: SQL Editor (in left sidebar)
2. **Click**: "New query"
3. **Copy/Paste**: All contents from `supabase-setup.sql`
4. **Run**: Click "Run" or press Cmd/Ctrl + Enter
5. **Verify**: You should see success messages

This creates:
- ✅ `members` table
- ✅ `reputation_history` table
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ `add_reputation()` function
- ✅ Auto-update trigger for `updated_at`

### 2. Get Your Service Role Key 🔑

1. **Navigate to**: Settings → API (in left sidebar)
2. **Find**: "service_role" key under "Project API keys"
3. **Copy**: The long key that starts with `eyJ...`
4. **Paste**: Into your `.env` file as `SUPABASE_SERVICE_KEY`

⚠️ **Important**: This key bypasses Row Level Security. Keep it secret and never commit to git!

### 3. Verify Tables Were Created ✅

1. **Navigate to**: Table Editor (in left sidebar)
2. **Check**: You should see two tables:
   - `members`
   - `reputation_history`

### 4. (Optional) Verify Row Level Security 🔒

1. **Navigate to**: Authentication → Policies
2. **Check**: You should see policies for:
   - `members` table: "Allow public read access to members"
   - `reputation_history` table: "Allow public read access to reputation_history"

These policies:
- ✅ Allow anyone to READ the data (for the leaderboard)
- ✅ Only allow service role to WRITE data (for security)

### 5. (Optional) Add Sample Data 📊

If you want to test with sample data, go to SQL Editor and run:

```sql
-- Create some test members
INSERT INTO members (name, reputation, github_username, avatar_url) VALUES
  ('Alice', 0, 'alice', 'https://avatars.githubusercontent.com/u/1'),
  ('Bob', 0, 'bob', 'https://avatars.githubusercontent.com/u/2'),
  ('Charlie', 0, 'charlie', 'https://avatars.githubusercontent.com/u/3');

-- Add some sample reputation
SELECT add_reputation('Alice', 100, 'Created the club repository', 'Project Contributions');
SELECT add_reputation('Alice', 50, 'Gave a great presentation', 'Learning & Sharing');
SELECT add_reputation('Bob', 75, 'Won hackathon', 'Achievements');
SELECT add_reputation('Bob', 30, 'Wrote tutorial on React', 'Learning & Sharing');
SELECT add_reputation('Charlie', 25, 'Fixed critical bug', 'Project Contributions');
```

### 6. Verify API Access 🌐

The Supabase URL you'll use is:
```
https://pyaheqkbmytxbbksuakp.supabase.co
```

This should be set as `SUPABASE_URL` in your `.env` file.

## What You Need for Your .env File

After completing the above steps, you need these values:

```bash
# From Supabase Dashboard → Settings → API
SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co

# From Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_KEY=eyJ...your-actual-key...

# Create your own strong random string
ADMIN_API_KEY=create-a-strong-random-password-here

# Local dev server (change for production)
API_URL=http://localhost:5173
```

## Troubleshooting

### "relation does not exist" error
- The SQL script didn't run successfully
- Re-run the script from `supabase-setup.sql`

### "permission denied" error
- Check that RLS policies were created
- Verify you're using the service_role key, not the anon key

### Can't see data in Table Editor
- Data might not exist yet
- Try running the sample data SQL above
- Or create members via the CLI tools

### API calls fail with 401
- Check that `SUPABASE_SERVICE_KEY` is correct
- Ensure you copied the service_role key, not the anon key

## Next Steps

Once you've completed these steps:

1. ✅ Copy `.env.example` to `.env`
2. ✅ Fill in your Supabase credentials
3. ✅ Run `npm install`
4. ✅ Run `npm run dev`
5. ✅ Visit http://localhost:5173

See `SETUP.md` for complete setup instructions.
