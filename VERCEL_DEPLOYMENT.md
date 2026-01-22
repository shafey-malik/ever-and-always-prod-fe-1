# Vercel Deployment Guide

This guide will walk you through deploying your Next.js Vendure storefront to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Vendure API**: Your Vendure backend should be deployed and accessible

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Committed

```bash
# Check git status
git status

# If you have uncommitted changes, commit them
git add .
git commit -m "Prepare for Vercel deployment"
```

### 1.2 Push to Remote Repository

```bash
# If you haven't pushed yet
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Your Repository**
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment Variables" section
   - Add the following variables (see Step 3 for values):

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Step 3: Configure Environment Variables

Add these environment variables in Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Variables

```
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://your-vendure-api.com/shop-api
```

**For Production:**
- Replace with your actual Vendure API URL
- Example: `https://api.yourstore.com/shop-api`
- Or if using demo: `https://readonlydemo.vendure.io/shop-api`

### Optional Variables

```
NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN=__default_channel__
VENDURE_CHANNEL_TOKEN=__default_channel__
NEXT_PUBLIC_SITE_NAME=Ever and Always
NEXT_PUBLIC_SITE_URL=https://your-domain.com
VENDURE_AUTH_TOKEN_COOKIE=vendure-auth-token
VENDURE_AUTH_TOKEN_HEADER=vendure-auth-token
VENDURE_CHANNEL_TOKEN_HEADER=vendure-token
```

### Environment Variable Scope

- **Production**: Add to "Production" environment
- **Preview**: Add to "Preview" environment (for branch deployments)
- **Development**: Usually not needed (use local .env.local)

## Step 4: Configure Build Settings

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Node.js Version**: 20.x (recommended)

## Step 5: Deploy

1. Click "Deploy" button
2. Wait for build to complete (usually 2-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

## Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## Step 7: Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Site loads without errors
- [ ] API calls work (check browser console)
- [ ] Images load correctly
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Checkout process works

### ✅ Performance Optimization

1. **Enable Vercel Analytics** (optional)
   - Project Settings → Analytics
   - Enable Web Analytics

2. **Configure Image Optimization**
   - Already configured in `next.config.ts`
   - Ensure your image domains are in `remotePatterns`

3. **Monitor Build Logs**
   - Check for any warnings or errors
   - Review build time and optimize if needed

## Troubleshooting

### Build Fails

**Error: Environment variable not set**
- Solution: Add all required environment variables in Vercel Dashboard

**Error: Module not found**
- Solution: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: TypeScript errors**
- Solution: Fix TypeScript errors locally first
- Run `npm run check-types` before deploying

### Runtime Errors

**API calls failing**
- Check `NEXT_PUBLIC_VENDURE_SHOP_API_URL` is correct
- Verify CORS is enabled on your Vendure backend
- Check network tab in browser DevTools

**Images not loading**
- Verify image domains in `next.config.ts` `remotePatterns`
- Check image URLs are accessible

**Authentication not working**
- Verify cookies are working (check browser DevTools)
- Ensure `VENDURE_AUTH_TOKEN_COOKIE` matches backend config

### Performance Issues

**Slow page loads**
- Enable Vercel Edge Network
- Check image optimization settings
- Review bundle size with `npm run build -- --analyze`

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main`/`master` branch
- **Preview**: Pushes to other branches (creates preview URLs)

## Useful Vercel Features

1. **Preview Deployments**: Every PR gets a preview URL
2. **Rollback**: Easy rollback to previous deployments
3. **Analytics**: Built-in performance monitoring
4. **Logs**: Real-time function and build logs
5. **Edge Functions**: Deploy serverless functions

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

## Quick Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

**Need Help?** Check Vercel's [deployment documentation](https://vercel.com/docs) or their [community forum](https://github.com/vercel/vercel/discussions).
