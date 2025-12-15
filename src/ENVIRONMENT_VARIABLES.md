# 🔐 Environment Variables for Vercel Deployment

Copy these exact values into Vercel's Environment Variables settings:

## Required Environment Variables

### 1. Supabase Configuration

```
SUPABASE_URL=https://xzbbsnlskjfmbszxgrqz.supabase.co
```

```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YmJzbmxza2pmbWJzenhncnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjE2NzUsImV4cCI6MjA4MDI5NzY3NX0.vfa_gEP7IhoPgKnoFXKyZ_8YUweqgXSEcW9NKgqUTNg
```

```
SUPABASE_SERVICE_ROLE_KEY=<GET THIS FROM SUPABASE DASHBOARD - Settings > API > service_role>
```

⚠️ **Important:** The `SUPABASE_SERVICE_ROLE_KEY` is SECRET and not stored in your code. Get it from:
1. Go to https://supabase.com/dashboard
2. Select your project (xzbbsnlskjfmbszxgrqz)
3. Settings → API
4. Copy the `service_role` key (click the eye icon to reveal it)

### 2. Stripe Configuration

```
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
```

Get this from:
1. Go to https://dashboard.stripe.com
2. Developers → API keys
3. Copy the "Secret key" (starts with `sk_`)

```
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>
```

Get this from:
1. Go to https://dashboard.stripe.com
2. Developers → Webhooks
3. Click on your webhook
4. Copy the "Signing secret" (starts with `whsec_`)

### 3. ElevenLabs Configuration

```
ELEVENLABS_API_KEY=<YOUR_ELEVENLABS_API_KEY>
```

Get this from:
1. Go to https://elevenlabs.io
2. Click on your profile
3. Copy your API key

---

## How to Add in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Click **"Add New"**
   - Enter **Name** (e.g., `SUPABASE_URL`)
   - Enter **Value** (paste the value from above)
   - Select **"Production"**, **"Preview"**, and **"Development"**
   - Click **"Save"**
5. Repeat for all variables
6. After adding all variables, go to **Deployments** and trigger a new deployment

---

## Verification Checklist

Before deploying, make sure you have:

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Dashboard)
- [ ] `STRIPE_SECRET_KEY` (from Stripe Dashboard)
- [ ] `STRIPE_WEBHOOK_SECRET` (from Stripe Webhooks)
- [ ] `ELEVENLABS_API_KEY` (from ElevenLabs)

All 6 variables must be set for the app to work correctly!

---

## Note About Database URL

The Supabase database is accessed through the Edge Functions, so you don't need to add `SUPABASE_DB_URL` to Vercel. That's only used in the Supabase Edge Function environment.
