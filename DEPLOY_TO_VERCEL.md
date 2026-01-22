# 🚀 Deploy to Vercel - Step by Step Guide

## Quick Start (5 Minutes)

### Method 1: Via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Click "Continue with GitHub" (or GitLab/Bitbucket)

3. **Import Your Project**
   - Select your repository
   - Click "Import"

4. **Configure Project** (Vercel auto-detects Next.js)
   - Framework: **Next.js** ✅ (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables**
   Click "Environment Variables" and add:

   **Required:**
   ```
   NEXT_PUBLIC_VENDURE_SHOP_API_URL
   ```
   Value: `https://your-vendure-api.com/shop-api`
   
   **For testing with demo:**
   ```
   NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://readonlydemo.vendure.io/shop-api
   ```

   **Optional (but recommended):**
   ```
   NEXT_PUBLIC_SITE_NAME=Ever and Always
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Your site will be live! 🎉

---

### Method 2: Via Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (follow prompts)
vercel

# 4. For production
vercel --prod
```

---

## 📋 Complete Environment Variables List

Add these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | Your Vendure API endpoint | `https://api.yourstore.com/shop-api` |

### Optional Variables (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_NAME` | `Ever and Always` | Site name for SEO |
| `NEXT_PUBLIC_SITE_URL` | `https://everandalways.com` | Your site URL |
| `NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN` | `__default_channel__` | Vendure channel token |
| `VENDURE_AUTH_TOKEN_COOKIE` | `vendure-auth-token` | Auth cookie name |
| `VENDURE_AUTH_TOKEN_HEADER` | `vendure-auth-token` | Auth header name |
| `VENDURE_CHANNEL_TOKEN_HEADER` | `vendure-token` | Channel header name |

### Setting Environment Variables in Vercel

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_VENDURE_SHOP_API_URL`)
   - **Value**: Variable value (e.g., `https://readonlydemo.vendure.io/shop-api`)
   - **Environment**: Select **Production**, **Preview**, and/or **Development**
4. Click **Save**
5. **Redeploy** your project for changes to take effect

---

## 🔧 Important Configuration

### Update Image Domains (if using custom Vendure)

If your Vendure API is on a custom domain, add it to `next.config.ts`:

```typescript
images: {
    remotePatterns: [
        {
            hostname: 'your-vendure-api.com', // Add your domain
        },
        // ... existing patterns
    ],
}
```

### CORS Configuration

Ensure your Vendure backend allows requests from your Vercel domain:
- Add `https://your-project.vercel.app` to CORS allowed origins
- Or use `*` for development (not recommended for production)

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] **Site loads**: Visit your Vercel URL
- [ ] **API works**: Check browser console for errors
- [ ] **Images load**: Verify product images display
- [ ] **Authentication**: Try logging in
- [ ] **Cart works**: Add items to cart
- [ ] **Checkout**: Test checkout flow (if applicable)

---

## 🐛 Troubleshooting

### Build Fails

**"Environment variable not set"**
- ✅ Add `NEXT_PUBLIC_VENDURE_SHOP_API_URL` in Vercel settings
- ✅ Redeploy after adding variables

**"Module not found"**
- ✅ Run `npm install` locally to verify dependencies
- ✅ Check `package.json` is committed

**TypeScript errors**
- ✅ Fix locally first: `npm run check-types`
- ✅ Commit fixes before deploying

### Runtime Issues

**API calls fail (CORS errors)**
- ✅ Configure CORS on Vendure backend
- ✅ Add Vercel domain to allowed origins

**Images don't load**
- ✅ Add image domain to `next.config.ts` `remotePatterns`
- ✅ Verify image URLs are accessible

**Authentication not working**
- ✅ Check cookies are enabled
- ✅ Verify `VENDURE_AUTH_TOKEN_COOKIE` matches backend

---

## 🔄 Continuous Deployment

Vercel automatically:
- ✅ Deploys **production** on push to `main`/`master`
- ✅ Creates **preview** deployments for other branches/PRs
- ✅ Provides unique URLs for each deployment

---

## 📊 Monitoring

### View Logs
- Vercel Dashboard → Your Project → **Deployments** → Click deployment → **Logs**

### Analytics
- Enable in **Settings** → **Analytics**
- View performance metrics

### Rollback
- **Deployments** → Select previous deployment → **Promote to Production**

---

## 🎯 Next Steps

1. **Custom Domain**: Add your domain in **Settings** → **Domains**
2. **Environment Variables**: Update for production API
3. **Monitoring**: Enable analytics and error tracking
4. **Optimization**: Review build logs and optimize if needed

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**Your deployment URL will be**: `https://your-project-name.vercel.app`

Good luck with your deployment! 🚀
