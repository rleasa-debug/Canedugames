# 🚀 Vercel Deployment Guide for CAN|EDU Games

## Step 1: Prepare Your GitHub Repository

### 1.1 Create a New GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** button in the top right
3. Select **"New repository"**
4. Name it: `canedu-games` (or any name you prefer)
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.2 Download Your Project Files
You need to download ALL files from this Figma Make project to your computer:
- All `.tsx` and `.ts` files
- All configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`, `vercel.json`)
- The `/components` folder
- The `/contexts` folder
- The `/utils` folder
- The `/supabase` folder
- The `/styles` folder
- The `/public` folder (if it exists)
- `index.html`
- `logo.svg`

### 1.3 Push to GitHub
Open Terminal/Command Prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - CAN|EDU Games"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/canedu-games.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Login"** if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find your `canedu-games` repository
3. Click **"Import"**

### 2.3 Configure Build Settings
Vercel should auto-detect these settings, but verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add these:

| Name | Value | Where to get it |
|------|-------|-----------------|
| `SUPABASE_URL` | Your Supabase URL | From Figma Make or Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | From Figma Make or Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | From Supabase Dashboard (keep secret!) |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | From Stripe Webhooks |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key | From ElevenLabs Dashboard |

**Important:** Check the values from your current Figma Make project by running:

```typescript
// You can check these in /utils/supabase/info.tsx
console.log(projectId);
console.log(publicAnonKey);
```

### 2.5 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a URL like: `https://canedu-games.vercel.app`

---

## Step 3: Update Supabase Edge Function URL

After deployment, you need to update the server URLs in your frontend code.

### 3.1 Get Your Vercel Domain
After deployment, you'll have a domain like: `canedu-games.vercel.app`

### 3.2 Keep Using Supabase Edge Functions
Your app uses Supabase Edge Functions at:
```
https://{projectId}.supabase.co/functions/v1/make-server-67fdf3bb
```

This should continue working! The Edge Functions are hosted on Supabase, not Vercel.

---

## Step 4: Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Find your webhook or create a new one
4. Update the endpoint URL to:
   ```
   https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-67fdf3bb/webhook/stripe
   ```
5. Make sure these events are selected:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

---

## Step 5: Test Your Deployment

### 5.1 Test the Homepage
Visit your Vercel URL and check:
- ✅ Logo loads correctly
- ✅ Games display properly
- ✅ Images from Unsplash load

### 5.2 Test Authentication
1. Try signing up with a new account
2. Try logging in
3. Try logging out

### 5.3 Test Games
1. Click on a game
2. Play through a few questions
3. Check that scores are saved

### 5.4 Test Stripe Subscription
1. Click "Upgrade to Premium"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Check that premium features unlock

---

## Common Issues & Fixes

### Issue: "Module not found" errors
**Fix:** Make sure all imports use the correct paths. Check:
- Import paths should be relative: `./components/Logo` not `/components/Logo`
- All imported files exist in your repository

### Issue: "Environment variables not found"
**Fix:** 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy: Deployments → Click ⋯ → Redeploy

### Issue: Stripe webhooks not working
**Fix:**
1. Make sure webhook URL points to Supabase Edge Function
2. Check that webhook secret matches in environment variables
3. Test webhook in Stripe Dashboard

### Issue: 404 errors on page refresh
**Fix:** Already handled by `vercel.json` rewrites. If still happening:
1. Check that `vercel.json` exists in your repo
2. Verify the rewrites configuration is correct

### Issue: Supabase functions not working
**Fix:**
1. Make sure you've deployed your Edge Functions to Supabase
2. Check CORS settings in `/supabase/functions/server/index.tsx`
3. Verify environment variables in Supabase Dashboard

---

## Updating Your Site

Whenever you make changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. Vercel will automatically rebuild and deploy! 🎉

---

## Getting Environment Variable Values

### From Figma Make (Current Project):
Check `/utils/supabase/info.tsx` - it contains your `projectId` and `publicAnonKey`

### From Supabase Dashboard:
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** → Use as `SUPABASE_ANON_KEY`
   - **service_role** → Use as `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## Need Help?

If you run into issues:
1. Check the Vercel build logs for errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Make sure all files are committed to GitHub

---

**Ready to deploy? Let's go! 🚀**
