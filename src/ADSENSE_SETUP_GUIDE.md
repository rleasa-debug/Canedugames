# 🎯 Google AdSense Setup Guide for CAN|EDU Games

## Step 1: Sign Up for Google AdSense

1. **Go to**: https://www.google.com/adsense/
2. **Click**: "Get Started"
3. **Sign in** with your Google account
4. **Enter your website URL**: Your deployed Figma Make site URL
5. **Complete application** with your:
   - Name and address
   - Phone number
   - Payment information (for when you get paid!)

## Step 2: Wait for Approval (1-2 weeks)

Google will review your site. They check for:
- ✅ Original, quality content (you have 19 educational games - perfect!)
- ✅ Sufficient content (you're good!)
- ✅ Easy navigation
- ✅ No prohibited content

**Tip**: While waiting, keep building traffic! Google likes sites with real users.

## Step 3: Get Your Publisher ID

Once approved, you'll get a **Publisher ID** like: `ca-pub-1234567890123456`

You'll see it in your AdSense dashboard under **Account** → **Settings**

## Step 4: Add AdSense Script to Your Site

You need to add this script to the `<head>` section of your HTML.

**In Figma Make, you'll need to**:
1. Add the script tag to your main HTML file
2. Replace `XXXXXXXXXXXXXXXX` with your actual Publisher ID

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

## Step 5: Enable Family-Friendly Ads (IMPORTANT!)

Since this is an educational site for kids:

1. Go to **Blocking controls** in AdSense dashboard
2. Navigate to **General categories**
3. **Enable**: "Allow only family-friendly ads"
4. **Block** categories like:
   - Dating
   - Gambling
   - Alcohol
   - Any adult content

This ensures only appropriate ads show to children! 🎓

## Step 6: Create Ad Units

1. In AdSense, go to **Ads** → **Overview** → **By ad unit**
2. Click **"Display ads"**
3. Create these ad units:

### Recommended Ad Units:

**Banner Ad** (for bottom of page):
- Type: Display ads
- Size: Responsive (auto-adjusts)
- Name: "CAN|EDU Bottom Banner"
- Copy the **Slot ID** (looks like: `1234567890`)

**Square Ad** (for sidebars):
- Type: Display ads
- Size: Square (300x250)
- Name: "CAN|EDU Square Ad"
- Copy the **Slot ID**

**In-Feed Ad** (between games):
- Type: In-feed ads
- Size: Responsive
- Name: "CAN|EDU Game Feed"
- Copy the **Slot ID**

## Step 7: Update Your Code

Open `/components/GoogleAd.tsx` and replace:

```typescript
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Your Publisher ID
```

Then update the slot IDs in:
- `BannerAd`: `slot="1234567890"` → Your banner slot ID
- `SquareAd`: `slot="0987654321"` → Your square slot ID  
- `InFeedAd`: `slot="1122334455"` → Your in-feed slot ID

## Step 8: Add Ads to Your App

The ads are already integrated! But if you want to add more:

```tsx
import { BannerAd, SquareAd, InFeedAd } from './components/GoogleAd';

// Bottom banner (already added in App.tsx)
<BannerAd isPremium={isPremium} />

// Square ad in game
<SquareAd isPremium={isPremium} />

// Between games in grid
<InFeedAd isPremium={isPremium} />
```

## Step 9: Test Your Ads

1. **Deploy your site** with the AdSense code
2. **Wait 24-48 hours** for ads to start showing
3. **Don't click your own ads!** This can get you banned
4. Use **AdSense sandbox mode** for testing if available

## Expected Revenue

For an educational site like yours:

**Conservative Estimates**:
- 1,000 monthly visitors: $10-30/month
- 5,000 monthly visitors: $50-150/month
- 10,000 monthly visitors: $100-300/month

**Your dual revenue model**:
- Free users → Ad revenue
- Premium users → $14.99/year subscription

## Alternative: Educational Affiliate Marketing

Instead of (or in addition to) AdSense, you could promote:

**Amazon Associates** (educational products):
- Canadian curriculum workbooks
- Educational toys
- STEM kits

**ShareASale** (educational partners):
- ABCmouse
- Reading Eggs
- Prodigy Math

This can be more profitable and more relevant to your audience!

## Comparison: Ads vs. Affiliates vs. Subscriptions

| Revenue Source | Setup Time | Monthly Potential | Control |
|----------------|------------|-------------------|---------|
| Google AdSense | 2 weeks | $20-200 | Low (Google decides) |
| Affiliates | 1 week | $50-500 | Medium (you choose products) |
| Subscriptions ($14.99/year) | Ready now! | $100+ (with 100 subs) | Full control |

## My Recommendation

**Start with subscriptions only** ($14.99/year premium):
- ✅ No approval wait time
- ✅ Full control
- ✅ Better user experience (no ads)
- ✅ Higher revenue per user
- ✅ You already have it built!

**Add AdSense later** if free users don't convert:
- Use family-friendly settings
- Keep ads minimal and non-intrusive
- Focus on bottom banner only

**Then add affiliates** for relevant products:
- Recommend Canadian curriculum books
- Educational game suggestions
- Link to your own recommended resources

## Need Help?

- **AdSense Help**: https://support.google.com/adsense/
- **Family-Safe Ads**: https://support.google.com/adsense/answer/9774392
- **AdSense Policies**: https://support.google.com/adsense/answer/48182

---

**Current Status**: ✅ Ad components ready, ⏳ Waiting for you to add AdSense script

Your ad infrastructure is built! You just need to:
1. Get AdSense approval
2. Add the script tag with your Publisher ID
3. Update slot IDs in `/components/GoogleAd.tsx`
