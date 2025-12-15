# 🚀 Deploy to Vercel - Quick Start (5 Minutes)

Follow these exact steps to get your site live!

## Before You Start

You'll need:
- A GitHub account
- A Vercel account (free - sign up with GitHub)
- Your environment variables ready (see ENVIRONMENT_VARIABLES.md)

---

## Step 1: Download All Files (1 minute)

Download these folders and files from Figma Make to your computer:

### Essential Files:
- ✅ `App.tsx`
- ✅ `main.tsx`
- ✅ `index.html`
- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `vercel.json`
- ✅ `logo.svg`

### Essential Folders (with all their contents):
- ✅ `/components` (entire folder)
- ✅ `/contexts` (entire folder)
- ✅ `/utils` (entire folder)
- ✅ `/supabase` (entire folder)
- ✅ `/styles` (entire folder)
- ✅ `/public` (if it exists)

**Tip:** Create a new folder on your Desktop called `canedu-games` and put everything there.

---

## Step 2: Push to GitHub (2 minutes)

### Option A: Using GitHub Desktop (Easier)
1. Download [GitHub Desktop](https://desktop.github.com)
2. Open GitHub Desktop
3. Click **File** → **Add Local Repository**
4. Select your `canedu-games` folder
5. Click **"Publish repository"**
6. Uncheck **"Keep this code private"** (or keep it checked if you want it private)
7. Click **"Publish repository"**

### Option B: Using Command Line
1. Open Terminal/Command Prompt
2. Navigate to your project folder:
   ```bash
   cd Desktop/canedu-games
   ```
3. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/canedu-games.git
   git push -u origin main
   ```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3: Deploy on Vercel (2 minutes)

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or Login)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 3.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. You'll see your `canedu-games` repository
3. Click **"Import"**

### 3.3 Configure Settings
Vercel will auto-detect most settings. Just verify:
- Framework: **Vite** ✅
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add these 6 variables:

1. **SUPABASE_URL**
   ```
   https://xzbbsnlskjfmbszxgrqz.supabase.co
   ```

2. **SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg
   ```

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Go to https://supabase.com/dashboard
   - Select project: xzbbsnlskjfmbszxgrqz
   - Settings → API → Copy `service_role` key

4. **STRIPE_SECRET_KEY**
   - Go to https://dashboard.stripe.com
   - Developers → API keys → Copy Secret key

5. **STRIPE_WEBHOOK_SECRET**
   - Go to https://dashboard.stripe.com
   - Developers → Webhooks → Copy Signing secret

6. **ELEVENLABS_API_KEY**
   - Go to https://elevenlabs.io
   - Profile → Copy API key

For each variable:
- Click **"Add Variable"**
- Type the name (e.g., `SUPABASE_URL`)
- Paste the value
- Select all three: Production, Preview, Development
- Click **"Add"**

### 3.5 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes ⏳
3. Done! 🎉

You'll get a live URL like: `https://canedu-games.vercel.app`

---

## Step 4: Test Your Site (1 minute)

Visit your new URL and test:
- ✅ Homepage loads
- ✅ Logo displays
- ✅ Can sign up/login
- ✅ Games work
- ✅ Scores save

---

## Troubleshooting

### "Build failed" error?
- Check that all files were uploaded to GitHub
- Verify `package.json`, `vite.config.ts`, and `tsconfig.json` exist
- Check the Vercel build logs for specific errors

### "Module not found" errors?
- Make sure ALL folders were uploaded (components, contexts, utils, etc.)
- Check that file names match exactly (case-sensitive!)

### Environment variables not working?
- Make sure all 6 variables are added in Vercel
- Click the **three dots** on your deployment → **"Redeploy"**

### Stripe not working?
- Update your Stripe webhook URL to point to:
  ```
  https://xzbbsnlskjfmbszxgrqz.supabase.co/functions/v1/make-server-67fdf3bb/webhook/stripe
  ```

---

## Next Steps

Once deployed, you can:
- Share your live URL with students
- Connect a custom domain (Settings → Domains)
- Monitor usage in Vercel Analytics
- Update your site by pushing to GitHub (auto-deploys!)

---

## Getting Help

If you're stuck:
1. Check the Vercel **build logs** for errors
2. Check your browser **console** (F12) for JavaScript errors
3. Verify all environment variables are set correctly
4. Make sure your Supabase Edge Functions are deployed

**Your site should be live in under 5 minutes! Let's go! 🚀**
