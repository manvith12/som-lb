# Quick Setup Guide

Follow these steps to get your reputation leaderboard up and running.

## Step 1: Set Up Supabase

1. **Go to your Supabase project**: https://pyaheqkbmytxbbksuakp.supabase.co

2. **Navigate to SQL Editor** (left sidebar)

3. **Create a new query** and copy the entire contents of `supabase-setup.sql`

4. **Run the query** - This will create:
   - `members` table
   - `reputation_history` table
   - Indexes for performance
   - Row Level Security policies
   - A helper function `add_reputation()`

5. **Get your Service Role Key**:
   - Go to Settings → API
   - Copy the `service_role` key (keep this secret!)

## Step 2: Configure Environment

1. **Copy the example env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and add your keys:
   ```bash
   SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key-from-step-1
   ADMIN_API_KEY=create-a-strong-random-password
   API_URL=http://localhost:5173
   ```

3. **Generate a strong API key** for `ADMIN_API_KEY`:
   ```bash
   # You can generate one with:
   openssl rand -base64 32
   # Or use any strong random string
   ```

## Step 3: Install and Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to http://localhost:5173

## Step 4: Add Your First Members

### Option 1: Create a member first, then add points

```bash
# Create the member
npm run create-member "Alice" "alice" "https://github.com/alice.png"

# Add reputation points
npm run add-rep "Alice" 100 "First member of the club!" "Bonus & Special"
```

### Option 2: Add points directly (auto-creates member)

```bash
npm run add-rep "Bob" 50 "Fixed critical bug in auth system" "Project Contributions"
```

## Step 5: Test the Leaderboard

1. Visit http://localhost:5173 - You should see your members!
2. Click on a member to see their reputation history
3. Visit http://localhost:5173/rubric to see the point system

## Common Issues

### "Missing environment variables"
- Make sure you created `.env` (not `.env.example`)
- Check that all required variables are set

### "Failed to fetch leaderboard data"
- Verify your Supabase URL and Service Key are correct
- Make sure you ran the SQL setup script
- Check Supabase logs for errors

### "Unauthorized" when using scripts
- Verify `ADMIN_API_KEY` is set correctly in `.env`
- Make sure you're using the same key in both server and scripts

### Scripts can't connect to API
- Make sure dev server is running (`npm run dev`)
- Check that `API_URL` matches your dev server URL
- For production, set `API_URL` to your deployed URL

## Next Steps

1. **Customize the rubric**: Edit `/src/routes/rubric/+page.svelte`
2. **Add your branding**: Update colors, logos, and text
3. **Set up analytics**: Configure Plausible in `.env`
4. **Deploy**: Build and deploy to your hosting platform

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform
2. Change `API_URL` to your production domain
3. Keep `SUPABASE_SERVICE_KEY` and `ADMIN_API_KEY` secret
4. Run `npm run build` to create production build

## Need Help?

- Check the main README.md for detailed documentation
- Review scripts/README.md for CLI tool usage
- Check Supabase logs for database errors
- Ensure Row Level Security policies are configured correctly
