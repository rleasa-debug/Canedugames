# 🚀 EASY MODE: Deploy CAN|EDU Games in 3 Steps

## The Problem
Your GitHub repo is empty, so Vercel can't find your code.

## The Solution (3 Simple Steps)

### Step 1: Download Your Code from Figma Make
1. In Figma Make, look for an **Export** or **Download** button (usually in the top right)
2. Download all your project files as a ZIP
3. Unzip the folder on your computer

### Step 2: Upload to GitHub
1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
2. Click the **"uploading an existing file"** link OR click **"Add file" > "Upload files"**
3. Drag ALL the files from your unzipped folder into GitHub
4. Scroll down and click **"Commit changes"**

### Step 3: Deploy to Vercel
1. Go back to Vercel: https://vercel.com
2. Click **"New Project"**
3. Select your GitHub repository (it should now show files!)
4. Vercel will auto-detect it's a Vite project
5. Click **"Deploy"**

---

## Important: Environment Variables

Before your site works, you need to add these in Vercel:

1. In Vercel, go to your project > **Settings** > **Environment Variables**
2. Add these variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-6006974250173608
```

3. Get these values from:
   - Supabase: https://app.supabase.com (Project Settings > API)
   - Stripe: https://dashboard.stripe.com/apikeys
   - ElevenLabs: https://elevenlabs.io (Profile > API Key)

---

## Alternative: Deploy Directly from Figma Make

Some versions of Figma Make have a direct deploy option. Look for:
- **"Deploy"** button in the top right
- **"Export"** or **"Publish"** options
- If you see these, click them and follow the prompts!

---

## Need Help?
If you're still stuck, tell me exactly where you're getting stuck and I'll help!
