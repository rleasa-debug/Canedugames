# 💰 Media.net Setup Guide - Step by Step

## Complete Guide to Selling Ad Space with Media.net

Follow these steps to start earning $5-12 per 1,000 visitors!

---

## ✅ Step 1: Sign Up for Media.net (5 minutes)

### Go to Media.net Website
**URL**: https://www.media.net/

### Click "Sign Up" or "Get Started"
- Choose "Publisher" account type (NOT advertiser)

### Fill Out Application:

**Website Information:**
- Website URL: `[your-live-site-url].com`
- Website Category: `Education`
- Primary Language: `English`
- Monthly Page Views: (be honest, even if low!)

**Personal Information:**
- Full Name
- Email Address
- Country: `Canada` 🇨🇦
- Phone Number

**Payment Information (for later):**
- You can add this after approval
- They support: PayPal, Wire Transfer, Check

### Important Tips for Approval:

✅ **DO:**
- Be honest about your traffic (they'll verify)
- Use your real information
- Make sure your site is live and accessible
- Have at least 5-10 pages of content
- Educational sites get approved easily!

❌ **DON'T:**
- Inflate traffic numbers
- Use fake email
- Apply with incomplete website

---

## ✅ Step 2: Wait for Approval (1-2 Days Usually!)

### What Happens Next:

1. **Automatic Review**: Media.net reviews your application
2. **Email Notification**: You'll get an email (usually within 24-48 hours)
3. **Approval**: Most educational sites get approved quickly!

### If Rejected (Rare for Educational Sites):
- Read their feedback email
- Fix any issues (usually just need more content)
- Re-apply in 7 days

### Expected Timeline:
- **Best case**: Approved in 12-24 hours
- **Average**: 1-2 days  
- **Worst case**: 3-4 days

**Check your email!** They'll send approval to your registered email.

---

## ✅ Step 3: Get Your Customer ID (2 minutes)

### After Approval:

1. **Log in** to Media.net dashboard: https://www.media.net/dashboard
2. Look in the top-right corner for your account settings
3. Find **Customer ID** (looks like: `8CU123456`)
4. **COPY THIS!** You'll need it in Step 5

### Where to Find It:
```
Dashboard → Settings → Account Information → Customer ID
```

**Example**: `8CU987654`

---

## ✅ Step 4: Create Your First Ad Unit (3 minutes)

### In Media.net Dashboard:

1. Go to **"Setup"** → **"Ad Units"** in the left menu
2. Click **"Create New Ad Unit"**
3. Choose **"Display Ad"**

### Ad Unit Settings:

**Ad Size**: `Responsive` (automatically adjusts to screen size)  
**Ad Type**: `Display`  
**Ad Unit Name**: `CAN-EDU-Games-Bottom-Banner` (for your records)

### Click "Create"

You'll get an **Ad Unit ID** (looks like: `123456789`)

**COPY THIS TOO!** You'll need both IDs.

---

## ✅ Step 5: Add IDs to Your Website (1 minute)

### Open This File:
`/components/MediaNetAds.tsx`

### Find These Lines (around line 29-30):
```typescript
const MEDIANET_CUSTOMER_ID = 'YOUR_CUSTOMER_ID'; // e.g., '8CU12345'
const MEDIANET_AD_UNIT_ID = 'YOUR_AD_UNIT_ID';   // e.g., '123456789'
```

### Replace with YOUR actual IDs:
```typescript
const MEDIANET_CUSTOMER_ID = '8CU987654'; // ← Your Customer ID from Step 3
const MEDIANET_AD_UNIT_ID = '123456789';  // ← Your Ad Unit ID from Step 4
```

### Save the file!

---

## ✅ Step 6: Test Your Ads (2 minutes)

### Deploy Your Site:
1. Save all changes
2. Deploy your updated site
3. Wait 2-3 minutes for deployment

### Test It:
1. Open your live website in a **new incognito window**
2. Log in as a **FREE user** (not premium)
3. Scroll to the bottom of the page
4. You should see the ad placeholder change to real ads!

### What You Should See:

**Before (not configured):**
```
💰 Media.net Ad Space Ready
Sign up at media.net to start earning!
```

**After (configured correctly):**
```
[ACTUAL ADS FROM YAHOO/BING NETWORK]
```

### If You Don't See Ads Yet:
- Wait 10-15 minutes (Media.net needs to verify your site)
- Make sure you're logged in as a FREE user (not premium)
- Check browser console for any errors
- Verify your IDs are correct

---

## ✅ Step 7: Track Your Earnings! 📊

### Media.net Dashboard:

**URL**: https://www.media.net/dashboard

### Key Metrics to Watch:

1. **Impressions**: How many times your ads are shown
2. **Clicks**: How many people click your ads
3. **RPM**: Revenue per 1,000 impressions
4. **Estimated Earnings**: How much you're making!

### Typical Performance:

| Metric | What to Expect |
|--------|----------------|
| **RPM** | $5-12 for educational sites |
| **Click-Through Rate** | 0.5% - 2% |
| **Fill Rate** | 80% - 95% |

### Payment Schedule:
- **Minimum Payout**: $100
- **Payment Method**: NET-30 (paid 30 days after month end)
- **Options**: PayPal, Wire Transfer, Check

---

## 💡 Pro Tips for Maximum Revenue

### 1. Ad Placement Matters!

**Best Performing Locations:**
- ✅ Bottom sticky banner (already implemented!)
- ✅ Between content/games
- ✅ In sidebar (if you add one)

**Worst Locations:**
- ❌ Above the fold (annoying to users)
- ❌ Too many ads per page

### 2. Traffic Quality

**High-Value Traffic** (Better RPM):
- 🇨🇦 Canada
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇦🇺 Australia

**Lower-Value Traffic**:
- Most other countries (but still earns!)

### 3. Content Matters

**Higher RPM Topics:**
- Education (that's you! ✅)
- Finance
- Technology
- Health

### 4. Don't Click Your Own Ads!

⚠️ **WARNING**: Never click your own ads!
- Media.net tracks this
- You'll get banned
- Test in incognito mode only

---

## 📊 Earnings Calculator

### Estimate Your Monthly Revenue:

**Formula**: `(Monthly Visitors ÷ 1000) × RPM`

**Examples:**

| Monthly Visitors | Low ($5 RPM) | Medium ($8 RPM) | High ($12 RPM) |
|-----------------|-------------|-----------------|----------------|
| 1,000 | $5 | $8 | $12 |
| 2,500 | $12.50 | $20 | $30 |
| 5,000 | $25 | $40 | $60 |
| 10,000 | $50 | $80 | $120 |
| 25,000 | $125 | $200 | $300 |
| 50,000 | $250 | $400 | $600 |

**Your Goal**: Get to 10,000 monthly visitors = $50-120/month! 🎯

---

## 🚀 What's Next?

### Week 1: Monitor Performance
- Check dashboard daily
- See which pages get most impressions
- Optimize ad placement if needed

### Week 2-4: Grow Traffic
- Share your site with teachers
- Post on social media
- Optimize for Google search

### Month 2: Scale Up
- Add more ad units (but don't overdo it!)
- Experiment with placement
- Consider adding Amazon affiliate links too

### At 10,000 Visitors: Upgrade to Ezoic
- Better RPM ($10-20 vs $5-12)
- More ad optimization
- Even higher earnings!

---

## ❓ Troubleshooting

### Problem: Ads Not Showing

**Check:**
1. ✅ Are your IDs correct in `/components/MediaNetAds.tsx`?
2. ✅ Did you save and deploy the changes?
3. ✅ Are you logged in as a FREE user (not premium)?
4. ✅ Did you wait 10-15 minutes after deployment?
5. ✅ Is your site approved by Media.net?

**Solutions:**
- Open browser console (F12) and check for errors
- Verify Customer ID and Ad Unit ID are correct
- Make sure MediaNetScript component is loaded
- Contact Media.net support if ads don't show after 24 hours

---

### Problem: Low RPM (Less than $5)

**Reasons:**
- Traffic from low-value countries
- Low content quality
- Poor ad placement
- Bot traffic (doesn't count)

**Solutions:**
- Focus on Canadian/US traffic
- Add more quality content
- Experiment with ad positions
- Promote on relevant platforms

---

### Problem: Account Suspended

**Common Reasons:**
- Clicking your own ads
- Invalid traffic (bots)
- Fraudulent activity
- Terms of service violation

**Prevention:**
- NEVER click your own ads
- Use real, organic traffic only
- Read and follow Media.net TOS
- Don't incentivize ad clicks

---

## 📞 Support & Resources

### Media.net Support:
- **Email**: publishers@media.net
- **Help Center**: https://www.media.net/contact
- **Publisher Blog**: https://www.media.net/blog/

### Dashboard Links:
- **Login**: https://www.media.net/dashboard
- **Reports**: https://www.media.net/reports
- **Ad Units**: https://www.media.net/adunits
- **Payments**: https://www.media.net/payments

---

## 🎉 Congratulations!

You're now set up to earn money from your educational website!

### Your Current Setup:

✅ Media.net account created  
✅ Ads integrated into your site  
✅ Free users see ads  
✅ Premium users get ad-free experience  
✅ Earning $5-12 per 1,000 visitors!

### Remember:

Your **$14.99/year subscription** is still your best revenue source!  
Media.net ads are bonus income on top of subscriptions. 💰

**Focus on growing traffic and conversions!** 🚀🇨🇦

---

## 🔄 Quick Reference

### Your Configuration File:
`/components/MediaNetAds.tsx`

### Your Ad Components:
- `<MediaNetScript />` - Loads Media.net (already in App.tsx)
- `<MediaNetBanner />` - Bottom sticky ad
- `<MediaNetCard />` - Inline content ad

### Need More Ads?

Add to any page (for free users only):
```tsx
import { MediaNetCard } from './components/MediaNetAds';

<MediaNetCard isPremium={isPremium} size="medium" />
```

---

**Questions?** Check the Media.net Help Center or their email support!

**Good luck earning! 🍁💰**
