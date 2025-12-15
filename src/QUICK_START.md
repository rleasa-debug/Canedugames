# 🚀 Quick Start - Get Your Site Live in 5 Minutes

## What We've Done

Your Figma Make project has been converted to work with Vercel. Here's what's ready:

✅ Vite configuration
✅ Package.json with all dependencies  
✅ TypeScript configuration
✅ Build setup (outputs to `dist` directory)
✅ Logo placeholder (you can replace with your own)
✅ Environment variable template

## Next Steps

### 1. Install Dependencies Locally (Optional - for testing)

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to test locally.

### 2. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Convert CAN EDU Games for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

**Option A: One-Click Deploy (Easiest)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Vite
4. Add your environment variables (see below)
5. Click "Deploy"

**Option B: Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### 4. Add Environment Variables in Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

```
SUPABASE_URL=https://xzbbsnlskjfmbszxgrqz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 5. Add Custom Domain

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add `canedugames.com` and `www.canedugames.com`
3. Update your DNS in Cloudflare:
   - A record: `@` → Vercel IP
   - CNAME: `www` → `cname.vercel-dns.com`

## Troubleshooting

### Site shows blank screen?
- Check browser console (F12) for errors
- Verify environment variables are set in Vercel
- Check build logs in Vercel dashboard

### Build failing?
- Check the Vercel build logs
- Ensure all dependencies are in package.json
- Make sure Node version is compatible (18+)

### Need help?
See the full `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Your Site Will Be Live! 🎉

Once deployed, your site will be accessible at:
- `https://your-project.vercel.app` (Vercel subdomain)
- `https://canedugames.com` (after DNS propagation)
- `https://www.canedugames.com` (after DNS propagation)

DNS propagation can take up to 48 hours, but usually completes in 5-15 minutes.
