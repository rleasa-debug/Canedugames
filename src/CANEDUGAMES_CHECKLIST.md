# ✅ canedugames.com Deployment Checklist

Print this out or keep it open while you work!

---

## STEP 1: Download Files ⏱️ 10 minutes

- [ ] Created `canedugames` folder on Desktop
- [ ] Downloaded all root files (App.tsx, main.tsx, package.json, etc.)
- [ ] Downloaded entire `/components` folder
- [ ] Downloaded entire `/contexts` folder
- [ ] Downloaded entire `/utils` folder
- [ ] Downloaded entire `/supabase` folder
- [ ] Downloaded entire `/styles` folder
- [ ] Verified all files are in correct folders

**Quick test:** Open `canedugames/App.tsx` - does it have content?

---

## STEP 2: GitHub ⏱️ 5 minutes

- [ ] Downloaded GitHub Desktop from https://desktop.github.com
- [ ] Installed and opened GitHub Desktop
- [ ] Signed in to GitHub (or created account)
- [ ] Added local repository (`canedugames` folder)
- [ ] Created repository
- [ ] Published to GitHub
- [ ] Verified repo exists at github.com/YOUR_USERNAME/canedugames

**Quick test:** Visit your GitHub repo in browser - do you see files?

---

## STEP 3: Vercel ⏱️ 10 minutes

### Vercel Setup
- [ ] Went to https://vercel.com
- [ ] Signed up with GitHub
- [ ] Clicked "Add New..." → "Project"
- [ ] Imported `canedugames` repository

### Environment Variables
Got all 6 variables added:

- [ ] `SUPABASE_URL` = `https://xzbbsnlskjfmbszxgrqz.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = (the long token)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase Dashboard → Settings → API)
- [ ] `STRIPE_SECRET_KEY` = (from Stripe Dashboard → Developers → API keys)
- [ ] `STRIPE_WEBHOOK_SECRET` = (from Stripe → Developers → Webhooks)
- [ ] `ELEVENLABS_API_KEY` = (from ElevenLabs → Profile)

### Deploy
- [ ] Clicked "Deploy"
- [ ] Waited 2-3 minutes
- [ ] Saw "Congratulations!" message
- [ ] Visited the .vercel.app URL
- [ ] Site loads correctly

**Quick test:** Does https://canedugames.vercel.app show your site?

---

## STEP 4: Connect Domain ⏱️ 5 minutes + wait time

### In Vercel
- [ ] Went to Settings → Domains
- [ ] Added `canedugames.com`
- [ ] Chose to use `canedugames.com` as main domain
- [ ] Got DNS records (A and CNAME)

### In Cloudflare
- [ ] Went to https://dash.cloudflare.com
- [ ] Clicked on `canedugames.com`
- [ ] Went to DNS → Records
- [ ] Added A record: `@` → `76.76.21.21` (orange cloud ☁️)
- [ ] Added CNAME record: `www` → `cname.vercel-dns.com` (orange cloud ☁️)

### Wait & Verify
- [ ] Waited 5-20 minutes for DNS propagation
- [ ] Vercel shows ✅ checkmark on domain
- [ ] Visited https://canedugames.com
- [ ] Site loads!
- [ ] HTTPS works automatically

**Quick test:** Does https://canedugames.com show your site?

---

## STEP 5: Test Everything ⏱️ 5 minutes

### Basic Tests
- [ ] Homepage loads
- [ ] Logo shows
- [ ] Game cards display
- [ ] Images load

### Auth Tests
- [ ] Can sign up
- [ ] Can log in
- [ ] Can log out

### Game Tests
- [ ] Can open a game
- [ ] Can answer questions
- [ ] Score updates
- [ ] Voice works

### Payment Tests
- [ ] "Upgrade to Premium" works
- [ ] Stripe checkout opens
- [ ] Test card works (4242 4242 4242 4242)
- [ ] Premium unlocks

---

## 🎉 DONE!

**Your site is live at: https://canedugames.com**

Share it with:
- [ ] Students
- [ ] Parents
- [ ] Teachers
- [ ] Friends
- [ ] Social media

---

## Quick Reference Links

| Service | URL | What You Need |
|---------|-----|---------------|
| **GitHub** | https://github.com | Your repo |
| **Vercel** | https://vercel.com | Project dashboard |
| **Cloudflare** | https://dash.cloudflare.com | DNS settings |
| **Supabase** | https://supabase.com/dashboard | API keys |
| **Stripe** | https://dashboard.stripe.com | Payment keys |
| **ElevenLabs** | https://elevenlabs.io | Voice API key |

---

## Emergency Contacts

**If something breaks:**
1. Check Vercel build logs
2. Check browser console (F12)
3. Verify environment variables
4. Ask for help!

---

## Making Updates

To update your site:
1. ✏️ Edit files in `canedugames` folder
2. 💾 Open GitHub Desktop
3. 📝 Write summary of changes
4. ✅ Click "Commit to main"
5. ⬆️ Click "Push origin"
6. ⏳ Wait 2-3 minutes
7. 🎉 Changes are live!

---

**Date Started:** _______________
**Date Completed:** _______________
**Live URL:** https://canedugames.com

**Notes:**
_________________________________
_________________________________
_________________________________
