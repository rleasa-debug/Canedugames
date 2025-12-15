# ✅ Media.net Setup Checklist

Quick reference to get Media.net ads running on your site!

---

## 📋 Pre-Setup (Do This First)

- [ ] Your website is live and accessible
- [ ] You have at least 5-10 pages of content
- [ ] Your site is fully functional (no "under construction")
- [ ] You have a valid email address
- [ ] You have payment information ready (for later)

---

## 🚀 Setup Steps (30 minutes total)

### Step 1: Sign Up (5 min)
- [ ] Go to https://www.media.net/
- [ ] Click "Sign Up" and choose "Publisher"
- [ ] Fill out application with:
  - [ ] Website URL
  - [ ] Category: Education
  - [ ] Your name and email
  - [ ] Country: Canada
  - [ ] Phone number
- [ ] Submit application

### Step 2: Wait for Approval (1-2 days)
- [ ] Check your email for approval notification
- [ ] If rejected, read feedback and re-apply
- [ ] Celebrate when approved! 🎉

### Step 3: Get Your IDs (5 min)
- [ ] Log in to https://www.media.net/dashboard
- [ ] Find your **Customer ID** (looks like: `8CU123456`)
- [ ] Write it down: `___________________`
- [ ] Go to Setup → Ad Units
- [ ] Click "Create New Ad Unit"
- [ ] Choose "Display Ad" → "Responsive"
- [ ] Name it: `CAN-EDU-Games-Bottom-Banner`
- [ ] Get your **Ad Unit ID** (looks like: `123456789`)
- [ ] Write it down: `___________________`

### Step 4: Update Your Code (2 min)
- [ ] Open `/components/MediaNetAds.tsx`
- [ ] Find line 29-30
- [ ] Replace `'YOUR_CUSTOMER_ID'` with your Customer ID
- [ ] Replace `'YOUR_AD_UNIT_ID'` with your Ad Unit ID
- [ ] Save the file
- [ ] Example:
```typescript
const MEDIANET_CUSTOMER_ID = '8CU987654'; // ← YOUR ID HERE
const MEDIANET_AD_UNIT_ID = '123456789';  // ← YOUR ID HERE
```

### Step 5: Test Your Ads (5 min)
- [ ] Deploy your website with the changes
- [ ] Wait 2-3 minutes for deployment
- [ ] Open your site in **incognito mode**
- [ ] Log in as a **FREE user** (not premium)
- [ ] Scroll to bottom of page
- [ ] Verify ads are showing (may take 10-15 minutes first time)
- [ ] If ads show: ✅ You're done!
- [ ] If not, wait 15 more minutes and check again

### Step 6: Monitor Earnings (ongoing)
- [ ] Bookmark https://www.media.net/dashboard
- [ ] Check daily for first week
- [ ] Set up payment information when you hit $100
- [ ] Celebrate your first earnings! 💰

---

## ✅ Verification Checklist

**Before Going Live:**
- [ ] Customer ID is correct (starts with `8CU`)
- [ ] Ad Unit ID is correct (numbers only)
- [ ] File saved and deployed
- [ ] MediaNetScript is loaded in App.tsx (already done ✅)
- [ ] Ads only show to FREE users (not premium)

**After Going Live:**
- [ ] Ads visible on live site (in incognito mode)
- [ ] Ads look professional and relevant
- [ ] Site loads quickly (ads don't slow it down)
- [ ] Dashboard shows impressions
- [ ] No console errors

---

## 🎯 Expected Results

### Day 1:
- ✅ Ads start showing on your site
- ✅ Dashboard shows first impressions
- ✅ $0-5 earned

### Week 1:
- ✅ Regular impressions recorded
- ✅ First clicks registered
- ✅ $5-20 earned (depending on traffic)

### Month 1:
- ✅ Consistent revenue stream
- ✅ RPM stabilizes ($5-12)
- ✅ First payout approaching ($100 threshold)

---

## 🚨 Common Issues & Fixes

### Issue: Ads not showing
**Check:**
- [ ] Are IDs correct?
- [ ] Did you save and deploy?
- [ ] Are you logged in as FREE user?
- [ ] Did you wait 15 minutes?

**Fix:**
- Double-check IDs in `/components/MediaNetAds.tsx`
- Open browser console (F12) for errors
- Wait up to 1 hour for first ads

---

### Issue: Dashboard shows zero impressions
**Check:**
- [ ] Is your site getting traffic?
- [ ] Are ads actually visible on page?
- [ ] Is script loading properly?

**Fix:**
- Share site to get traffic
- Check "Network" tab in browser dev tools
- Verify MediaNetScript component is rendering

---

### Issue: Very low RPM (under $3)
**Possible Reasons:**
- Traffic from low-value countries
- Bot/fake traffic
- Poor content quality
- New site (needs time)

**Fix:**
- Focus on Canadian/US traffic
- Promote on real platforms
- Add more quality content
- Give it 2-3 weeks to stabilize

---

## 💰 Revenue Expectations

| Monthly Visitors | Expected Monthly Revenue |
|-----------------|-------------------------|
| 500 | $2-6 |
| 1,000 | $5-12 |
| 2,500 | $12-30 |
| 5,000 | $25-60 |
| 10,000 | $50-120 |
| 25,000 | $125-300 |

**Remember:** These are FROM ADS ONLY!  
Your $14.99/year subscriptions add even more revenue! 💪

---

## 📞 Need Help?

### Media.net Support:
- **Email**: publishers@media.net
- **Help Center**: https://www.media.net/contact
- **Dashboard**: https://www.media.net/dashboard

### Your Files:
- **Configuration**: `/components/MediaNetAds.tsx`
- **Setup Guide**: `/MEDIANET_SETUP_GUIDE.md`
- **Revenue Comparison**: `/AD_REVENUE_COMPARISON.md`

---

## 🎉 Success Criteria

You're successful when:

- ✅ Ads showing on your live site
- ✅ Dashboard tracking impressions
- ✅ No errors in browser console
- ✅ Earning $5-12 per 1,000 visitors
- ✅ First payout received! 💰

---

## 🔄 Monthly Checklist

**Every Month:**
- [ ] Check dashboard earnings
- [ ] Review RPM trends
- [ ] Optimize ad placement if needed
- [ ] Track traffic growth
- [ ] Celebrate progress! 🎊

**At $100 Earnings:**
- [ ] Set up payment method
- [ ] Verify tax information
- [ ] Request payout
- [ ] Reinvest in growing your site!

---

## 🚀 Next Steps

Once Media.net is running:

1. **Focus on Traffic**: Get to 10,000 monthly visitors
2. **Add Amazon Affiliates**: Extra revenue stream
3. **Grow Subscriptions**: Your best revenue source!
4. **At 10k visitors**: Upgrade to Ezoic ($10-20 RPM)
5. **At 50k visitors**: Apply to Mediavine ($15-25 RPM)

---

**Good luck! You've got this! 🍁💰**

Print this checklist and check off items as you complete them!
