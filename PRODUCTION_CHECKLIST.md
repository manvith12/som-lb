# Production Deployment Checklist

Use this checklist to ensure your deployment is production-ready.

## Pre-Deployment

### Code Quality
- [ ] Run `npm run build` locally - builds successfully
- [ ] Run `npm run check` - no TypeScript errors
- [ ] Test the app locally with `npm run dev`
- [ ] Test all API endpoints work
- [ ] Test CLI tools work locally

### Environment Configuration
- [ ] `.env.example` is up to date
- [ ] `.env` is in `.gitignore` (already done ✅)
- [ ] All sensitive keys are in `.env`, not hardcoded

### Database Setup
- [ ] Supabase SQL schema (`supabase-setup.sql`) has been run
- [ ] Tables created: `members`, `reputation_history`
- [ ] Row Level Security policies are active
- [ ] Service role key obtained from Supabase Dashboard

### Security
- [ ] Admin API key is strong and random
- [ ] Service role key is kept secret
- [ ] No secrets committed to git
- [ ] CORS is properly configured (handled by SvelteKit)

## Deployment Steps

### 1. Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. - [ ] Go to [vercel.com](https://vercel.com)
2. - [ ] Click "Add New Project"
3. - [ ] Import your GitHub repository
4. - [ ] Verify build settings:
   - Framework: SvelteKit ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.svelte-kit` ✅
5. - [ ] Add environment variables (see below)
6. - [ ] Click "Deploy"

#### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

**Required Variables:**

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://pyaheqkbmytxbbksuakp.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | `eyJ...` | From Supabase Dashboard → Settings → API |
| `ADMIN_API_KEY` | Strong random string | For CLI tool authentication |

**Optional Variables:**

| Variable | Value | Notes |
|----------|-------|-------|
| `PUBLIC_PLAUSIBLE_ENABLED` | `false` | Set to `true` if using analytics |
| `PUBLIC_PLAUSIBLE_HOST` | `https://plausible.io` | Your Plausible instance |
| `PUBLIC_SITE_DOMAIN` | `your-domain.vercel.app` | Your domain name |

**Important:** 
- [ ] Add variables for ALL environments (Production, Preview, Development)
- [ ] Click "Redeploy" after adding variables

### 4. Post-Deployment Testing

- [ ] Visit your Vercel URL: `https://your-project.vercel.app`
- [ ] Leaderboard loads without errors
- [ ] Rubric page loads: `/rubric`
- [ ] Search functionality works
- [ ] No console errors in browser DevTools

### 5. Test CLI Tools with Production

Update your local `.env`:
```bash
API_URL=https://your-project.vercel.app
```

Test CLI:
```bash
# Create a test member
npm run create-member "Test User" "testuser"

# Add reputation
npm run add-rep "Test User" 50 "Testing production" "Bonus & Special"
```

- [ ] Member created successfully
- [ ] Reputation added successfully
- [ ] Member appears on leaderboard
- [ ] History shows in member popup

### 6. Custom Domain (Optional)

If using a custom domain:

1. - [ ] Add domain in Vercel → Settings → Domains
2. - [ ] Configure DNS records as shown
3. - [ ] Wait for SSL certificate (auto-provisioned)
4. - [ ] Update `PUBLIC_SITE_DOMAIN` environment variable
5. - [ ] Update `API_URL` in your local `.env`
6. - [ ] Test at your custom domain

## Post-Deployment

### Monitoring
- [ ] Bookmark Vercel dashboard for your project
- [ ] Check deployment logs for any warnings
- [ ] Monitor Supabase usage dashboard
- [ ] Set up Vercel analytics (optional)

### Documentation
- [ ] Share production URL with team
- [ ] Document how to add members
- [ ] Document how to award reputation
- [ ] Share rubric page URL

### Backup Plan
- [ ] Export Supabase data as backup
- [ ] Document rollback procedure
- [ ] Keep previous deployment available in Vercel

## Troubleshooting

### Build Fails
```bash
# Test locally first
npm run build

# Check for TypeScript errors
npm run check

# View build logs in Vercel dashboard
```

### Environment Variables Not Working
- Verify they're added for ALL environments
- Check for typos in variable names
- Redeploy after adding variables
- Check Vercel function logs for errors

### API Endpoints Return Errors
- Check Vercel function logs
- Verify Supabase credentials
- Test Supabase connection in SQL Editor
- Ensure RLS policies allow service role

### CLI Tools Can't Connect
- Verify `API_URL` points to your Vercel domain
- Check `ADMIN_API_KEY` matches in Vercel
- Ensure production deployment is live
- Test API endpoint manually with curl

## Performance Optimization

- [ ] Enable Vercel Analytics (optional)
- [ ] Set up Supabase connection pooling (for high traffic)
- [ ] Consider adding Redis cache (for very high traffic)
- [ ] Monitor response times in Vercel dashboard

## Security Hardening

- [ ] Review Supabase RLS policies
- [ ] Enable Supabase database backups
- [ ] Set up IP restrictions (if needed)
- [ ] Rotate API keys periodically
- [ ] Monitor Supabase audit logs

## Maintenance Schedule

### Weekly
- [ ] Check Vercel deployment status
- [ ] Review error logs
- [ ] Monitor Supabase usage

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review and optimize database queries
- [ ] Check for security updates
- [ ] Export database backup

### Quarterly
- [ ] Rotate API keys
- [ ] Review and update rubric
- [ ] Analyze usage patterns
- [ ] Consider feature additions

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Repository Issues**: [Your GitHub repo]/issues

## Rollback Procedure

If deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click ⋯ menu → "Promote to Production"
4. Fix issues locally
5. Redeploy when ready

## Success Criteria

Your deployment is successful when:

- ✅ Leaderboard loads and displays correctly
- ✅ All pages accessible (home, rubric)
- ✅ Search functionality works
- ✅ CLI tools can create members
- ✅ CLI tools can add reputation
- ✅ Member history displays correctly
- ✅ No errors in browser console
- ✅ No errors in Vercel function logs
- ✅ Response times < 1 second
- ✅ Custom domain working (if applicable)

---

**🎉 Congratulations! Your reputation leaderboard is now in production!**

Next steps:
1. Share the URL with your club members
2. Start tracking reputation
3. Celebrate your deployment! 🚀
