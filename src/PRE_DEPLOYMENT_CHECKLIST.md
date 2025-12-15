# ✅ Pre-Deployment Checklist

Before deploying to Vercel, make sure you have everything ready!

## 📋 Files to Download

Download ALL these files from Figma Make:

### Root Files
- [ ] App.tsx
- [ ] main.tsx
- [ ] index.html
- [ ] package.json
- [ ] vite.config.ts
- [ ] tsconfig.json
- [ ] tsconfig.node.json
- [ ] vercel.json
- [ ] logo.svg

### Folders (Complete with all contents)
- [ ] `/components` - ALL 60+ component files
- [ ] `/contexts` - 3 context files
- [ ] `/utils` - Supabase client files
- [ ] `/supabase/functions/server` - Edge function files
- [ ] `/styles` - globals.css
- [ ] `/public` - (if it exists)

**Important:** Make sure you download the ENTIRE contents of each folder, not just the folder itself!

---

## 🔑 Environment Variables to Gather

Before deploying, have these ready:

### From Your Current Figma Make Project
- [ ] Supabase URL: `https://xzbbsnlskjfmbszxgrqz.supabase.co`
- [ ] Supabase Anon Key: Already provided ✅

### From Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/xzbbsnlskjfmbszxgrqz
2. Navigate to: **Settings** → **API**
3. Copy and save:
   - [ ] `service_role` key (click eye icon to reveal)

### From Stripe Dashboard
1. Go to: https://dashboard.stripe.com
2. Navigate to: **Developers** → **API keys**
3. Copy and save:
   - [ ] Secret key (starts with `sk_test_` or `sk_live_`)
4. Navigate to: **Developers** → **Webhooks**
5. Copy and save:
   - [ ] Webhook signing secret (starts with `whsec_`)

### From ElevenLabs
1. Go to: https://elevenlabs.io
2. Click your profile picture
3. Copy and save:
   - [ ] API key

---

## 🌐 GitHub Account

- [ ] Have a GitHub account (or create one at https://github.com)
- [ ] Know your GitHub username
- [ ] Can create new repositories

---

## ☁️ Vercel Account

- [ ] Have a Vercel account (or will sign up with GitHub)
- [ ] Ready to connect Vercel to your GitHub account

---

## 🔍 Verification Before Upload

Before pushing to GitHub, verify locally:

### Check File Structure
Your `canedu-games` folder should look like:
```
canedu-games/
├── App.tsx
├── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── logo.svg
├── components/
│   ├── Logo.tsx
│   ├── Auth.tsx
│   ├── ... (60+ more files)
├── contexts/
│   ├── ScoreContext.tsx
│   ├── ProgressionContext.tsx
│   └── AuthContext.tsx
├── utils/
│   └── supabase/
│       ├── client.tsx
│       └── info.tsx
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx
│           ├── kv_store.tsx
│           └── elevenlabs.tsx
└── styles/
    └── globals.css
```

### Check Critical Files

Open and verify these files exist and have content:

- [ ] `package.json` - Has dependencies for React, Vite, Supabase, Stripe
- [ ] `vite.config.ts` - Has React plugin and build config
- [ ] `vercel.json` - Has rewrites configuration
- [ ] `App.tsx` - Main app component (should be ~1000+ lines)
- [ ] `components/Logo.tsx` - SVG logo component

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- Upload only some files - you need ALL files
- Forget the `/components` folder
- Skip environment variables
- Use wrong environment variable values
- Forget to deploy Supabase Edge Functions first

### ✅ DO:
- Download everything from Figma Make
- Double-check all folders are complete
- Have all 6 environment variables ready
- Test locally if possible (run `npm install` then `npm run dev`)
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret

---

## 📝 Quick Test After Deployment

Once deployed, test these features:

### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Logo displays correctly
- [ ] All game cards show images
- [ ] Text-to-speech works (click speaker icon)

### Authentication
- [ ] Can create new account
- [ ] Can log in
- [ ] Can log out
- [ ] Session persists on refresh

### Games
- [ ] Can click and open a game
- [ ] Game loads without errors
- [ ] Can answer questions
- [ ] Score updates correctly
- [ ] Can go back to home

### Premium Features
- [ ] Can click "Upgrade to Premium"
- [ ] Stripe checkout loads
- [ ] (Use test card: 4242 4242 4242 4242)
- [ ] Returns to site after payment
- [ ] Premium status activates

### Admin Features (if applicable)
- [ ] Admin can see dashboard
- [ ] Can view student data
- [ ] Reports load correctly

---

## 🆘 Help Resources

If something goes wrong:

### Vercel Build Errors
- Check build logs in Vercel dashboard
- Look for "Module not found" - means missing files
- Look for "Environment variable" - means missing env vars

### Runtime Errors
- Open browser console (press F12)
- Check Network tab for failed requests
- Check Console tab for JavaScript errors

### Supabase Errors
- Verify Edge Functions are deployed
- Check environment variables match
- Test authentication in Supabase dashboard

### Stripe Errors
- Verify webhook URL is correct
- Check webhook secret matches
- Test in Stripe's test mode first

---

## ✨ You're Ready!

Once you've checked everything above, you're ready to deploy!

Follow the **DEPLOY_NOW.md** guide for step-by-step instructions.

**Time to deploy: ~5 minutes**

Good luck! 🚀
