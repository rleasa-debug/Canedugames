# CAN|EDU Games - Vercel Deployment Guide

This project has been converted from Figma Make to work with Vercel deployment.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your environment variables ready

## Step 1: Push to GitHub

1. Create a new GitHub repository at https://github.com/new
2. In your local project directory, run:

```bash
git init
git add .
git commit -m "Initial commit - CAN EDU Games"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure your project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following variables from your Supabase project:
     ```
     SUPABASE_URL=https://xzbbsnlskjfmbszxgrqz.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     SUPABASE_DB_URL=your_database_url_here
     STRIPE_SECRET_KEY=your_stripe_secret_key_here
     STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
     ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
     ```
   
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 3: Configure Custom Domain

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain: `canedugames.com`
4. Add www variant: `www.canedugames.com`
5. Follow Vercel's DNS configuration instructions

## Step 4: Update Cloudflare DNS (if using Cloudflare)

1. Log into Cloudflare
2. Select your domain `canedugames.com`
3. Go to DNS settings
4. Add/Update these records:
   - **A Record**: `@` → Vercel's IP (provided by Vercel)
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
5. Set Proxy status to "DNS only" (grey cloud) initially
6. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Step 5: Add Logo Image

The deployment uses `/public/logo.png` for the logo. You need to:

1. Create a `public` folder in your project root (if it doesn't exist)
2. Add your logo image as `/public/logo.png`
3. Commit and push:
   ```bash
   git add public/logo.png
   git commit -m "Add logo image"
   git push
   ```

Vercel will automatically redeploy when you push to GitHub.

## Troubleshooting

### Blank Screen Issues

1. **Check Browser Console**: Open DevTools (F12) and check for errors
2. **Check Vercel Logs**: Go to Vercel Dashboard → Your Project → Deployments → Click on latest deployment → View Function Logs
3. **Verify Environment Variables**: Make sure all required env vars are set in Vercel

### Build Failures

1. Check the build logs in Vercel
2. Ensure `package.json` has all dependencies
3. Verify Node version compatibility (Vercel uses Node 18 by default)

### CORS Issues

If you see CORS errors:
1. Check that your Supabase URL is correct
2. Verify that your domain is added to Supabase's allowed origins:
   - Go to Supabase Dashboard
   - Settings → API
   - Add your Vercel domain to "Site URL"

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Authentication works (sign up/login)
- [ ] Games load and function correctly
- [ ] Premium features work
- [ ] Custom domain resolves correctly
- [ ] SSL certificate is active (https works)
- [ ] Google AdSense ads display correctly

## Additional Configuration

### Google AdSense

Your AdSense Publisher ID (`ca-pub-6006974250173608`) is already configured in the code. Make sure:
1. Your domain is added to your AdSense account
2. Ads are enabled for your site
3. You've passed AdSense review

### Stripe

Ensure your Stripe webhooks point to:
```
https://xzbbsnlskjfmbszxgrqz.supabase.co/functions/v1/make-server-67fdf3bb/stripe/webhook
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for client-side errors
3. Check Supabase logs for backend errors
4. Verify all environment variables are correctly set

## Development

To run locally:

```bash
npm install
npm run dev
```

Create a `.env` file in the root with your environment variables (see `.env.example`).
