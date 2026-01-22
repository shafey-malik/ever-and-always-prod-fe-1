# Quick Deployment Checklist

## Before Deploying

- [ ] Code is committed and pushed to Git repository
- [ ] Build passes locally: `npm run build`
- [ ] TypeScript checks pass: `npm run check-types`
- [ ] All environment variables documented

## Environment Variables to Set in Vercel

### Required (Must Set)
```
NEXT_PUBLIC_VENDURE_SHOP_API_URL=<your-vendure-api-url>/shop-api
```

### Recommended (Set for Production)
```
NEXT_PUBLIC_SITE_NAME=Ever and Always
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Optional (Defaults work, but can customize)
```
NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN=__default_channel__
VENDURE_AUTH_TOKEN_COOKIE=vendure-auth-token
VENDURE_AUTH_TOKEN_HEADER=vendure-auth-token
VENDURE_CHANNEL_TOKEN_HEADER=vendure-token
```

## Vercel Deployment Steps

1. **Go to**: https://vercel.com/new
2. **Import** your Git repository
3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Add Environment Variables** (see above)
5. **Deploy** and wait for build
6. **Test** your deployed site

## Post-Deployment

- [ ] Site loads successfully
- [ ] API connection works
- [ ] Images display correctly
- [ ] Authentication works
- [ ] Cart/checkout functions
- [ ] Custom domain configured (if applicable)

## Quick Commands

```bash
# Deploy via CLI
npm i -g vercel
vercel login
vercel --prod
```
