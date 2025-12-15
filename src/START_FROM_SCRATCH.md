# 🎯 Complete Setup Guide: Domain → Live Website

## What You'll Accomplish
By the end of this guide, you'll have:
- ✅ Your CAN|EDU Games website live on your custom domain
- ✅ HTTPS security (automatic)
- ✅ All features working (games, authentication, payments)
- ✅ Professional email-ready domain

**Total Time:** ~30 minutes

---

## PART 1: Prepare Your Files (10 minutes)

### Step 1.1: Create a Project Folder
1. On your computer, create a new folder on your Desktop
2. Name it: `canedu-games`

### Step 1.2: Download Files from Figma Make

You need to download ALL files from this Figma Make project to your `canedu-games` folder.

**How to download from Figma Make:**
1. Click on a file in the Figma Make file browser (left side)
2. Copy all the content (Ctrl+A, Ctrl+C or Cmd+A, Cmd+C)
3. Create a new file on your computer with the same name
4. Paste the content
5. Save the file

**Files to download:**

#### Root Files (in the main `canedu-games` folder):
- `App.tsx`
- `main.tsx`
- `index.html`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `vercel.json`
- `logo.svg`

#### Create these folders and download their contents:

**`/components`** - Create this folder and download ALL 60+ files:
- `Logo.tsx`
- `Auth.tsx`
- `GameCard.tsx`
- `MathGame.tsx`
- `ReadingGame.tsx`
- `SpellingGame.tsx`
- ... (and ALL other component files you see in Figma Make)

**`/contexts`** - Create this folder and download:
- `ScoreContext.tsx`
- `ProgressionContext.tsx`
- `AuthContext.tsx`

**`/utils/supabase`** - Create these nested folders and download:
- `client.tsx`
- `info.tsx`

**`/styles`** - Create this folder and download:
- `globals.css`

**`/supabase/functions/server`** - Create these nested folders and download:
- `index.tsx`
- `kv_store.tsx`
- `elevenlabs.tsx`

**`/public`** - Create this folder (may be empty, that's okay)

---

## PART 2: Push to GitHub (5 minutes)

### Option A: Using GitHub Desktop (Easier - Recommended!)

1. **Download GitHub Desktop**
   - Go to https://desktop.github.com
   - Download and install

2. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Click "Sign up"
   - Follow the steps

3. **Publish Your Repository**
   - Open GitHub Desktop
   - Click **File** → **Add Local Repository**
   - Click **Choose...** and select your `canedu-games` folder
   - GitHub Desktop will say "This directory does not appear to be a Git repository"
   - Click **"Create a Repository"**
   - Repository name: `canedu-games`
   - Click **"Create Repository"**
   - Click **"Publish repository"** (top right)
   - Uncheck "Keep this code private" (or keep it checked if you prefer)
   - Click **"Publish repository"**

Done! ✅ Your code is now on GitHub.

### Option B: Using Command Line

```bash
cd ~/Desktop/canedu-games
git init
git add .
git commit -m "Initial commit - CAN|EDU Games"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/canedu-games.git
git push -u origin main
```

---

## PART 3: Deploy to Vercel (10 minutes)

### Step 3.1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. Allow Vercel to access your repositories

### Step 3.2: Import Your Project
1. You'll land on the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Find `canedu-games` in the list
4. Click **"Import"**

### Step 3.3: Configure Build Settings
Vercel should auto-detect everything:
- Framework Preset: **Vite** ✅
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅
- Install Command: `npm install` ✅

**Don't click Deploy yet!** We need to add environment variables first.

### Step 3.4: Add Environment Variables

Click **"Environment Variables"** section and add these:

#### Variable 1: SUPABASE_URL
- Name: `SUPABASE_URL`
- Value: `https://xzbbsnlskjfmbszxgrqz.supabase.co`
- Select: Production, Preview, Development

#### Variable 2: SUPABASE_ANON_KEY
- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg`
- Select: Production, Preview, Development

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: **Get this from Supabase Dashboard** 👇
  1. Go to https://supabase.com/dashboard
  2. Sign in (you should already have an account from Figma Make)
  3. Select your project: `xzbbsnlskjfmbszxgrqz`
  4. Go to **Settings** (gear icon on left) → **API**
  5. Find `service_role` key
  6. Click the eye icon to reveal it
  7. Copy and paste it here
- Select: Production, Preview, Development

#### Variable 4: STRIPE_SECRET_KEY
- Name: `STRIPE_SECRET_KEY`
- Value: **Get this from Stripe Dashboard** 👇
  1. Go to https://dashboard.stripe.com
  2. Sign in
  3. Click **Developers** → **API keys**
  4. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)
  5. Paste it here
- Select: Production, Preview, Development

#### Variable 5: STRIPE_WEBHOOK_SECRET
- Name: `STRIPE_WEBHOOK_SECRET`
- Value: **Get this from Stripe Webhooks** 👇
  1. Still in Stripe Dashboard
  2. Click **Developers** → **Webhooks**
  3. Click on your existing webhook (or create one)
  4. Copy the **Signing secret** (starts with `whsec_`)
  5. Paste it here
- Select: Production, Preview, Development

#### Variable 6: ELEVENLABS_API_KEY
- Name: `ELEVENLABS_API_KEY`
- Value: **Get this from ElevenLabs** 👇
  1. Go to https://elevenlabs.io
  2. Sign in
  3. Click your profile picture → **Profile**
  4. Copy your **API Key**
  5. Paste it here
- Select: Production, Preview, Development

### Step 3.5: Deploy!
1. After adding all 6 environment variables, click **"Deploy"**
2. Wait 2-3 minutes for the build to complete ⏳
3. You'll see "Congratulations! 🎉"
4. Click **"Visit"** to see your site

**You now have a live website!** It will be at something like:
`https://canedu-games.vercel.app` or `https://canedu-games-abc123.vercel.app`

---

## PART 4: Connect Your Cloudflare Domain (5 minutes)

Now let's connect your custom domain!

### Step 4.1: Add Domain in Vercel
1. In Vercel, go to your project
2. Click **"Settings"** → **"Domains"**
3. Type your domain (e.g., `canedu.com`)
4. Click **"Add"**

### Step 4.2: Choose Domain Configuration

Vercel will ask: **"Which domain would you like to add?"**

Choose one of these options:

**Option A: Use the root domain** (Recommended)
- `canedu.com` → Your website
- Vercel will also auto-configure `www.canedu.com` to redirect

**Option B: Use www subdomain**
- `www.canedu.com` → Your website
- You can redirect `canedu.com` to `www.canedu.com`

**Option C: Use a subdomain**
- `games.canedu.com` → Your website
- Keep `canedu.com` for something else

### Step 4.3: Configure DNS in Cloudflare

After adding your domain, Vercel will show you DNS records to add.

1. **Open Cloudflare in another tab**
   - Go to https://dash.cloudflare.com
   - Click on your domain

2. **Go to DNS settings**
   - Click **"DNS"** in the left menu
   - Click **"Records"**

3. **Add the records Vercel provides**

Vercel will show you something like:

**For root domain (canedu.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**In Cloudflare:**
1. Click **"Add record"**
2. Select **Type** (A or CNAME)
3. Enter **Name** (@ or www)
4. Enter **Target/Value**
5. **Proxy status:** Click the cloud icon to make it **orange** (Proxied)
6. Click **"Save"**
7. Repeat for each record

### Step 4.4: Wait for DNS Propagation
- DNS changes can take 5 minutes to 24 hours
- Usually it's ready in 5-10 minutes
- Vercel will automatically detect when it's ready

### Step 4.5: Verify It Works
1. Go to your domain: `https://yourdomain.com`
2. Your website should load! 🎉
3. HTTPS will be automatic (Vercel handles it)

---

## PART 5: Final Configuration (5 minutes)

### Update Stripe Webhook URL
1. Go to https://dashboard.stripe.com
2. Click **Developers** → **Webhooks**
3. Click on your webhook
4. Update the endpoint URL to:
   ```
   https://xzbbsnlskjfmbszxgrqz.supabase.co/functions/v1/make-server-67fdf3bb/webhook/stripe
   ```
5. Make sure these events are selected:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click **"Update endpoint"**

### Test Everything
Visit your live site and test:
- ✅ Homepage loads
- ✅ Can sign up / log in
- ✅ Games work
- ✅ Scores save
- ✅ Voice works
- ✅ Premium upgrade works

---

## 🎉 You're Live!

Your website is now:
- ✅ Live on your custom domain
- ✅ Secured with HTTPS
- ✅ Fast and globally distributed
- ✅ Automatically deploys when you update code

---

## Updating Your Site

Whenever you want to make changes:

1. Edit files in your local `canedu-games` folder
2. In GitHub Desktop:
   - It will show your changes
   - Add a summary (e.g., "Added new game")
   - Click **"Commit to main"**
   - Click **"Push origin"**
3. Vercel automatically rebuilds and deploys! (takes 2-3 minutes)

---

## Common Issues

### "Domain not yet configured" in Vercel
- Wait 5-10 minutes for DNS to propagate
- Check DNS records in Cloudflare match exactly
- Make sure Cloudflare proxy is ON (orange cloud)

### "Build failed" in Vercel
- Check build logs for specific error
- Make sure all files were uploaded to GitHub
- Verify all 6 environment variables are set

### Stripe webhooks not working
- Make sure webhook URL points to Supabase (not Vercel)
- Check webhook secret matches environment variable
- Test with Stripe's "Send test webhook" button

### Games not saving scores
- Check browser console (F12) for errors
- Verify Supabase environment variables are correct
- Make sure you're logged in

---

## Need Help?

If you get stuck at any step, let me know:
- What step are you on?
- What error message do you see?
- Screenshot if possible

I'm here to help! 🚀
