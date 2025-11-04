# Vercel Deployment Guide

This guide will help you deploy your Reputation Leaderboard to Vercel in production.

## Prerequisites

- A Vercel account (free tier works fine)
- GitHub repository with your code
- Supabase project set up with the schema

## Step 1: Prepare Your Repository

1. **Make sure `.gitignore` is set up** (already done ✅)
   - `.env` files are excluded
   - `node_modules` is excluded

2. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to** [vercel.com](https://vercel.com) and sign in

2. **Click "Add New Project"**

3. **Import your Git repository**
   - Select your GitHub repository
   - Click "Import"

4. **Configure the project**:
   - **Framework Preset**: SvelteKit (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.svelte-kit` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co
   SUPABASE_SERVICE_KEY=<your-service-role-key>
   ADMIN_API_KEY=<your-admin-api-key>
   
   PUBLIC_PLAUSIBLE_ENABLED=false
   PUBLIC_PLAUSIBLE_HOST=https://plausible.io
   PUBLIC_SITE_DOMAIN=your-domain.vercel.app
   ```

   ⚠️ **Important**: Add these for ALL environments (Production, Preview, Development)

6. **Click "Deploy"**

7. **Wait for deployment** (usually takes 1-2 minutes)

8. **Get your URL**: `https://your-project.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts and add environment variables
```

## Step 3: Configure Environment Variables

After deployment, you need to set environment variables:

1. Go to your project dashboard on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://pyaheqkbmytxbbksuakp.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | Your service_role key from Supabase | Production, Preview, Development |
| `ADMIN_API_KEY` | Your strong random API key | Production, Preview, Development |
| `PUBLIC_PLAUSIBLE_ENABLED` | `false` (or `true` if using analytics) | Production, Preview, Development |
| `PUBLIC_PLAUSIBLE_HOST` | `https://plausible.io` | Production, Preview, Development |
| `PUBLIC_SITE_DOMAIN` | Your Vercel domain | Production, Preview, Development |

4. **Redeploy** after adding variables (click "Redeploy" in Deployments tab)

## Step 4: Update CLI Scripts for Production

After deployment, update your `.env` file locally to use the production URL:

```bash
# Local .env file
SUPABASE_URL=https://pyaheqkbmytxbbksuakp.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
ADMIN_API_KEY=your-admin-api-key
API_URL=https://your-project.vercel.app  # ← Update this to your Vercel URL
```

Now your CLI tools will work with the production deployment:

```bash
npm run add-rep "Alice" 100 "First member" "Bonus & Special"
npm run create-member "Bob" "bob"
```

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`

2. **Test the leaderboard**:
   - Should load without errors
   - Should show "0 members found" initially

3. **Test the rubric page**: `https://your-project.vercel.app/rubric`

4. **Add a test member using CLI**:
   ```bash
   npm run create-member "Test User" "testuser"
   npm run add-rep "Test User" 50 "Testing deployment" "Bonus & Special"
   ```

5. **Refresh the leaderboard** - you should see the test member!

## Step 6: Set Up Custom Domain (Optional)

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `PUBLIC_SITE_DOMAIN` environment variable
5. Update `API_URL` in your local `.env`

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch → `your-project.vercel.app`
- **Preview**: Pushes to other branches → `your-project-git-branch.vercel.app`

## Monitoring and Logs

### View Logs

1. Go to your project on Vercel
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab to see serverless function logs

### Real-time Logs

```bash
vercel logs --follow
```

## Troubleshooting

### "Missing environment variables" error

**Solution**: Add all environment variables in Vercel dashboard, then redeploy

### API endpoints return 500 errors

**Solution**: 
1. Check Vercel function logs for errors
2. Verify `SUPABASE_SERVICE_KEY` is correct
3. Ensure Supabase RLS policies are configured

### CLI tools can't connect

**Solution**:
1. Update `API_URL` in local `.env` to your Vercel URL
2. Make sure `ADMIN_API_KEY` matches in both Vercel and local `.env`
3. Ensure the Vercel deployment is live

### Build fails on Vercel

**Solution**:
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Try building locally: `npm run build`
4. Check for TypeScript errors

### Supabase connection fails

**Solution**:
1. Verify Supabase URL is correct
2. Check service_role key is valid
3. Ensure Supabase project is not paused
4. Check RLS policies allow service role access

## Performance Optimization

### Enable Caching (Already Configured ✅)

The app uses 5-minute cache for leaderboard data:
- First request fetches from Supabase
- Subsequent requests serve from cache
- Cache refreshes every 5 minutes

### Edge Functions

Vercel automatically deploys your API routes as edge functions for global low latency.

### ISR (Incremental Static Regeneration)

For even better performance, consider adding ISR to static pages:

```javascript
// src/routes/rubric/+page.server.ts
export const config = {
  isr: {
    expiration: 3600, // 1 hour
  },
};
```

## Security Checklist

- ✅ `.env` files excluded from git
- ✅ Service role key only in environment variables (never in code)
- ✅ Admin API key required for write operations
- ✅ Row Level Security enabled on Supabase
- ✅ Public endpoints are read-only

## Scaling

Vercel free tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function executions
- ✅ Automatic scaling

For high traffic, consider upgrading to Pro.

## Maintenance

### Update Dependencies

```bash
npm update
npm run build  # Test locally
git commit -am "Update dependencies"
git push  # Auto-deploys to Vercel
```

### Database Backups

Set up automated backups in Supabase:
1. Go to Supabase Dashboard
2. Settings → Database
3. Enable Point-in-Time Recovery (paid feature)

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **SvelteKit Docs**: https://kit.svelte.dev
- **Supabase Docs**: https://supabase.io/docs
- **Your App Logs**: https://vercel.com/[your-project]/logs

---

## Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs --follow

# List deployments
vercel ls

# Redeploy
vercel --prod --force

# Add environment variable
vercel env add VARIABLE_NAME
```

## Post-Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] Deployment successful
- [ ] Leaderboard loads correctly
- [ ] Rubric page accessible
- [ ] CLI tools configured with production URL
- [ ] Test member creation works
- [ ] Test reputation addition works
- [ ] Custom domain configured (if applicable)
- [ ] Analytics set up (if using Plausible)

---

**Congratulations! Your reputation leaderboard is now live! 🎉**

Share your URL with your club members and start tracking reputation!
