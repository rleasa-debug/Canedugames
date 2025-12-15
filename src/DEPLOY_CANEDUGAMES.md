# 🚀 Deploy CAN|EDU Games to canedugames.com

## Your Mission
Get your educational games website live at **https://canedugames.com** in 30 minutes!

---

## STEP 1: Download Your Files (10 minutes)

### 1.1 Create Project Folder
1. Open your **Desktop**
2. Create a new folder called: `canedugames`

### 1.2 Download Files from Figma Make

You need to copy ALL files from this Figma Make project to your computer.

**How to download each file:**
1. Click on a file in Figma Make's file browser (left side)
2. Select all content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Create a new file on your computer with the exact same name
5. Paste the content
6. Save

**Download these files to your `canedugames` folder:**

#### Root Files (directly in `canedugames` folder):
- [ ] `App.tsx`
- [ ] `main.tsx`
- [ ] `index.html`
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `vercel.json`
- [ ] `logo.svg`

#### Components Folder
Create a folder called `components` inside `canedugames`, then download ALL these files into it:

**Essential components (download ALL of these):**
- [ ] `Logo.tsx`
- [ ] `Auth.tsx`
- [ ] `AuthButton.tsx`
- [ ] `GameCard.tsx`
- [ ] `ScoreDisplay.tsx`
- [ ] `LevelDisplay.tsx`
- [ ] `LevelUpModal.tsx`
- [ ] `VoiceToggle.tsx`
- [ ] `TextWithVoice.tsx`
- [ ] `PremiumUpgrade.tsx`
- [ ] `UpgradeBanner.tsx`
- [ ] `SubscriptionSuccess.tsx`
- [ ] `ProgressDashboard.tsx`
- [ ] `ReportCard.tsx`
- [ ] `Leaderboard.tsx`
- [ ] `AdminDashboard.tsx`

**Game components (download ALL of these):**
- [ ] `MathGame.tsx`
- [ ] `ReadingGame.tsx`
- [ ] `SpellingGame.tsx`
- [ ] `TypingGame.tsx`
- [ ] `MathQuiz.tsx`
- [ ] `TimesTablesPractice.tsx`
- [ ] `PhonicsGame.tsx`
- [ ] `RhymingGame.tsx`
- [ ] `SpellingBee.tsx`
- [ ] `ReadingComprehension.tsx`
- [ ] `VowelSoundsSorting.tsx`
- [ ] `PrefixSuffixGame.tsx`
- [ ] `ISpyWords.tsx`
- [ ] `SentenceStars.tsx`
- [ ] `StorySequencing.tsx`
- [ ] `MathMatchingGame.tsx`
- [ ] `PatternRecognition.tsx`
- [ ] `ShapeComparisonGame.tsx`
- [ ] `FactorBattleship.tsx`
- [ ] `AngleBisectorGame.tsx`
- [ ] `MappingMapleLeaf.tsx`
- [ ] `GeographyQuiz.tsx`
- [ ] `ChartInterpretation.tsx`
- [ ] `CurriculumInfo.tsx`
- [ ] `MazeGame.tsx`
- [ ] `TypingTest.tsx`

**Ad components:**
- [ ] `AdBanner.tsx`
- [ ] `GoogleAdSense.tsx`
- [ ] `UniversalAd.tsx`

**Policy components:**
- [ ] `PrivacyPolicy.tsx`
- [ ] `TermsOfService.tsx`

**Also download the `/components/ui` folder** - Create `ui` folder inside `components` and download all UI files

**And the `/components/games` folder** - Create `games` folder inside `components` and download:
- [ ] `WordFamilyKeys.tsx`

**And the `/components/figma` folder:**
- [ ] `ImageWithFallback.tsx`

#### Contexts Folder
Create a folder called `contexts`, then download:
- [ ] `ScoreContext.tsx`
- [ ] `ProgressionContext.tsx`
- [ ] `AuthContext.tsx`

#### Utils Folder
Create `utils` folder, then create `supabase` folder inside it, then download:
- [ ] `utils/supabase/client.tsx`
- [ ] `utils/supabase/info.tsx`
- [ ] `utils/voice.ts` (in the utils folder, not supabase)

#### Supabase Folder
Create `supabase/functions/server` nested folders, then download:
- [ ] `supabase/functions/server/index.tsx`
- [ ] `supabase/functions/server/kv_store.tsx`
- [ ] `supabase/functions/server/elevenlabs.tsx`

#### Styles Folder
Create `styles` folder, then download:
- [ ] `styles/globals.css`

#### Public Folder (optional)
Create `public` folder (may be empty)

**Tip:** This will take about 10 minutes of copy-pasting. It's tedious but important to get ALL files!

---

## STEP 2: Upload to GitHub (5 minutes)

### Option A: GitHub Desktop (Recommended - Easier!)

1. **Download GitHub Desktop**
   - Go to https://desktop.github.com
   - Download and install
   - Open GitHub Desktop

2. **Sign in to GitHub**
   - If you don't have a GitHub account, create one at https://github.com (it's free!)
   - In GitHub Desktop, click **File** → **Options** → **Sign In**
   - Sign in with your GitHub account

3. **Add Your Project**
   - Click **File** → **Add Local Repository**
   - Click **Choose...** 
   - Select your `canedugames` folder from Desktop
   - You'll see a message: "This directory does not appear to be a Git repository"
   - Click **"Create a Repository"**

4. **Create Repository**
   - Name: `canedugames`
   - Description: "CAN|EDU Games - Canadian Curriculum Educational Games"
   - Keep "Initialize this repository with a README" UNCHECKED
   - Click **"Create Repository"**

5. **Publish to GitHub**
   - Click **"Publish repository"** in the top toolbar
   - Repository name: `canedugames`
   - Uncheck "Keep this code private" (or keep checked if you prefer private)
   - Click **"Publish repository"**

✅ Done! Your code is now on GitHub at: `https://github.com/YOUR_USERNAME/canedugames`

---

## STEP 3: Deploy to Vercel (10 minutes)

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Click **"Install"** to let Vercel access your repositories

### 3.2 Import Your Project

1. You'll land on the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **canedugames** in the list
5. Click **"Import"**

### 3.3 Configure Project Settings

Vercel will auto-detect your settings. Verify these are correct:

- **Framework Preset:** Vite ✅
- **Root Directory:** ./ ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install` ✅

**DON'T CLICK DEPLOY YET!** We need to add environment variables first.

### 3.4 Add Environment Variables

Scroll down to the **"Environment Variables"** section.

You need to add 6 variables. For each one:
1. Enter the **Name**
2. Paste the **Value**
3. Make sure **ALL THREE** are checked: Production, Preview, Development
4. Click **"Add"**

#### Variable 1: SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://xzbbsnlskjfmbszxgrqz.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2: SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY

**You need to get this from Supabase Dashboard:**

1. Open a new tab and go to: https://supabase.com/dashboard
2. Sign in (you should have an account from Figma Make)
3. You'll see your project: **xzbbsnlskjfmbszxgrqz**
4. Click on it to open the project
5. Click the **Settings** icon (⚙️) in the left sidebar
6. Click **"API"**
7. Scroll to **"Project API keys"**
8. Find the **service_role** key
9. Click the **eye icon** (👁️) to reveal it
10. Click **Copy** icon
11. Paste it in Vercel:

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [PASTE THE KEY YOU JUST COPIED]
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 4: STRIPE_SECRET_KEY

**You need to get this from Stripe Dashboard:**

1. Go to: https://dashboard.stripe.com
2. Sign in
3. Click **"Developers"** in the top menu
4. Click **"API keys"**
5. Find **"Secret key"** (it starts with `sk_test_` or `sk_live_`)
6. Click **"Reveal test key"**
7. Copy it
8. Paste it in Vercel:

```
Name: STRIPE_SECRET_KEY
Value: [PASTE YOUR STRIPE SECRET KEY]
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 5: STRIPE_WEBHOOK_SECRET

**You need to get this from Stripe Webhooks:**

1. Still in Stripe Dashboard
2. Click **"Developers"** → **"Webhooks"**
3. You should see an existing webhook endpoint
4. Click on it
5. Find **"Signing secret"** (starts with `whsec_`)
6. Click **"Reveal"**
7. Copy it
8. Paste it in Vercel:

```
Name: STRIPE_WEBHOOK_SECRET
Value: [PASTE YOUR WEBHOOK SECRET]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Note:** If you don't have a webhook yet, we'll create one later. For now, use a placeholder like `whsec_placeholder` and we'll update it.

#### Variable 6: ELEVENLABS_API_KEY

**You need to get this from ElevenLabs:**

1. Go to: https://elevenlabs.io
2. Sign in
3. Click on your **profile picture** (top right)
4. Click **"Profile + API Key"** or **"Profile"**
5. Copy your **API Key**
6. Paste it in Vercel:

```
Name: ELEVENLABS_API_KEY
Value: [PASTE YOUR ELEVENLABS API KEY]
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3.5 Deploy!

1. After adding all 6 environment variables, click **"Deploy"**
2. Vercel will start building your site
3. You'll see a progress screen with logs
4. Wait 2-3 minutes ⏳
5. When it's done, you'll see: **"Congratulations! Your project has been deployed."** 🎉

### 3.6 Test Your Vercel URL

1. Click **"Visit"** or **"Go to Dashboard"**
2. You'll see your deployment
3. Click on the **screenshot** or **domain** (something like `canedugames.vercel.app`)
4. Your website should load!

✅ **Checkpoint:** Your website is now live at `https://canedugames.vercel.app` (or similar)

Test it:
- Does the homepage load?
- Do you see the logo?
- Do games show up?

If yes, continue to Step 4! If no, let me know what error you see.

---

## STEP 4: Connect Your Domain (5 minutes)

Now let's make your site accessible at **canedugames.com**!

### 4.1 Add Domain in Vercel

1. In Vercel, go to your **canedugames** project dashboard
2. Click **"Settings"** (top menu)
3. Click **"Domains"** (left sidebar)
4. You'll see a box that says "Enter domain name"
5. Type: `canedugames.com`
6. Click **"Add"**

### 4.2 Choose Configuration

Vercel will ask: **"Which domain do you want to use?"**

Select: **canedugames.com** (recommended)

This will:
- ✅ Make `canedugames.com` your main site
- ✅ Automatically set up `www.canedugames.com` to redirect to `canedugames.com`

Click **"Add"**

### 4.3 Get DNS Records

Vercel will now show you DNS records to add. You'll see something like:

**For canedugames.com:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.canedugames.com:**
```
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Important:** Keep this Vercel tab open! We'll need these values.

### 4.4 Add DNS Records in Cloudflare

1. Open a new tab and go to: https://dash.cloudflare.com
2. Sign in
3. Click on **canedugames.com** (your domain)
4. Click **"DNS"** in the left menu
5. Click **"Records"**

Now add the records:

#### Add Record 1: Root Domain (A Record)

1. Click **"Add record"**
2. **Type:** Select **A**
3. **Name:** Type `@` (this means root domain)
4. **IPv4 address:** Type `76.76.21.21` (copy from Vercel)
5. **Proxy status:** Click the cloud to make it **Orange** (Proxied) ☁️
6. **TTL:** Auto
7. Click **"Save"**

#### Add Record 2: WWW Subdomain (CNAME Record)

1. Click **"Add record"** again
2. **Type:** Select **CNAME**
3. **Name:** Type `www`
4. **Target:** Type `cname.vercel-dns.com` (copy from Vercel)
5. **Proxy status:** Click the cloud to make it **Orange** (Proxied) ☁️
6. **TTL:** Auto
7. Click **"Save"**

### 4.5 Wait for DNS Propagation

1. Go back to your **Vercel tab**
2. Vercel will automatically check if DNS is configured
3. You'll see: "Waiting for DNS propagation..."
4. This usually takes **5-10 minutes** (sometimes up to 1 hour)
5. Vercel will show a ✅ checkmark when it's ready

**While you wait:** Grab a coffee! ☕

### 4.6 Verify Your Domain Works

After DNS propagates:

1. Open a new browser tab
2. Go to: `https://canedugames.com`
3. Your website should load! 🎉
4. Try also: `https://www.canedugames.com` (should redirect to main)

**HTTPS is automatic!** Vercel handles SSL certificates for you.

---

## STEP 5: Final Configuration (5 minutes)

### 5.1 Update Stripe Webhook (if needed)

Your Stripe webhook should already point to your Supabase Edge Function. Let's verify:

1. Go to: https://dashboard.stripe.com
2. Click **"Developers"** → **"Webhooks"**
3. Click on your webhook endpoint
4. Verify the URL is:
   ```
   https://xzbbsnlskjfmbszxgrqz.supabase.co/functions/v1/make-server-67fdf3bb/webhook/stripe
   ```
5. If it's different, click **"..."** → **"Update details"**
6. Update the endpoint URL
7. Make sure these events are selected:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
8. Click **"Update endpoint"**

### 5.2 Test Everything on Your Live Site

Visit **https://canedugames.com** and test:

#### Basic Functionality
- [ ] Homepage loads
- [ ] Logo displays correctly
- [ ] All game cards show
- [ ] Images load from Unsplash
- [ ] Click a game - does it open?

#### Authentication
- [ ] Click "Sign Up"
- [ ] Create a new account
- [ ] Log in
- [ ] Log out
- [ ] Log back in

#### Games & Scoring
- [ ] Open a game
- [ ] Play through a few questions
- [ ] Check if score increases
- [ ] Check if level progress updates
- [ ] Try the voice toggle (speaker icon)

#### Premium Features
- [ ] Click "Upgrade to Premium"
- [ ] Stripe checkout opens
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date (e.g., `12/25`)
- [ ] CVC: Any 3 digits (e.g., `123`)
- [ ] Complete checkout
- [ ] Returns to your site
- [ ] Premium features unlock

### 5.3 Check Google AdSense (Optional)

If ads don't show yet, that's normal! Google needs to:
1. Verify your site
2. Review your content
3. Approve ads (takes 1-3 days)

Your AdSense code is already in the site with your Publisher ID: `ca-pub-6006974250173608`

---

## 🎉 YOU'RE LIVE!

Your website is now:
- ✅ Live at **https://canedugames.com**
- ✅ Secured with HTTPS
- ✅ Fast and globally distributed (via Vercel + Cloudflare)
- ✅ Automatically deploys when you update code
- ✅ Has working authentication
- ✅ Has working payments
- ✅ Has text-to-speech
- ✅ Ready for students!

---

## Making Updates to Your Site

Whenever you want to change something:

### Using GitHub Desktop:
1. Edit files on your computer (in the `canedugames` folder)
2. Open **GitHub Desktop**
3. You'll see your changes listed
4. Write a summary (e.g., "Added new math game")
5. Click **"Commit to main"**
6. Click **"Push origin"** (top right)
7. Vercel automatically rebuilds and deploys (2-3 minutes)
8. Changes go live automatically!

---

## Common Issues & Solutions

### "Domain not configured" in Vercel
**Solution:**
- Wait 10-15 minutes for DNS to propagate
- Check Cloudflare DNS records match exactly
- Make sure proxy is ON (orange cloud ☁️)
- Try clearing your browser cache

### "Build failed" in Vercel
**Solution:**
- Click on the failed deployment
- Read the error logs
- Common causes:
  - Missing files (check all files uploaded to GitHub)
  - Missing environment variables (check all 6 are set)
  - Syntax error in code

### Games not loading
**Solution:**
- Open browser console (F12)
- Check for errors
- Verify Supabase environment variables are correct
- Make sure you're logged in

### Premium upgrade not working
**Solution:**
- Check Stripe environment variables
- Verify webhook URL is correct
- Test with Stripe test card: `4242 4242 4242 4242`
- Check webhook events are selected

### Voice not working
**Solution:**
- Check ElevenLabs API key is correct
- Voice may fall back to browser speech (that's normal)
- Check browser console for errors

---

## Next Steps

### Share Your Site
- Share **canedugames.com** with students, parents, teachers
- Post on social media
- Add to your email signature

### Monitor Usage
- Check Vercel Analytics (in your Vercel dashboard)
- Monitor Stripe subscriptions
- Check Supabase usage

### Add Custom Email (Optional)
You can set up professional email like:
- `contact@canedugames.com`
- `support@canedugames.com`

Do this through Cloudflare Email Routing (free!) or Google Workspace.

### Custom Features
Want to add something new? Just:
1. Edit files locally
2. Push to GitHub
3. Auto-deploys!

---

## 🎓 Your Site Stats

- **Domain:** canedugames.com ✅
- **Hosting:** Vercel (free tier) ✅
- **Database:** Supabase (free tier) ✅
- **Payments:** Stripe ✅
- **Voice:** ElevenLabs ✅
- **Ads:** Google AdSense ✅
- **SSL:** Automatic HTTPS ✅
- **CDN:** Global (Cloudflare + Vercel) ✅

**Monthly costs:** 
- Domain: ~$10/year from Cloudflare
- Everything else: FREE (until you scale up!)

---

## Need Help?

If you run into any issues:
1. Check the error message carefully
2. Look in browser console (F12)
3. Check Vercel build logs
4. Tell me:
   - What step you're on
   - What error you see
   - Screenshot if possible

I'm here to help you get live! 🚀

---

**Ready to start? Go to STEP 1 and let's get canedugames.com online!**
