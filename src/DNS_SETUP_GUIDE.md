# DNS Setup Guide - Fix ERR_NAME_NOT_RESOLVED

## The Problem
Your domain `canedugames.com` is not resolving because DNS records aren't configured to point to Vercel.

## Solution: Configure DNS in Your Domain Registrar

### Step 1: Find Your Domain Registrar
Where did you buy `canedugames.com`? Common registrars:
- GoDaddy
- Namecheap
- Google Domains / Squarespace
- Cloudflare
- Domain.com

### Step 2: Add DNS Records

Login to your domain registrar and add these DNS records:

#### Option A: Using A Records (Recommended)
Add these **A records**:

| Type | Name | Value              | TTL  |
|------|------|--------------------|------|
| A    | @    | 76.76.21.21       | 3600 |
| A    | www  | 76.76.21.21       | 3600 |

#### Option B: Using CNAME (Alternative)
Add this **CNAME record**:

| Type  | Name | Value                      | TTL  |
|-------|------|----------------------------|------|
| CNAME | www  | cname.vercel-dns.com       | 3600 |

**Note:** You can't use CNAME for the root domain (@), so you'd still need an A record for the root.

### Step 3: Verify in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Add domain: `canedugames.com`
4. Add domain: `www.canedugames.com`
5. Vercel will show DNS configuration instructions

### Step 4: Wait for DNS Propagation
- DNS changes take **5 minutes to 48 hours** to propagate
- Usually works within **15-30 minutes**
- Check status at: https://dnschecker.org/#A/canedugames.com

## Quick Test

While waiting for DNS, you can access your site directly via Vercel URL:
```
https://your-project-name.vercel.app
```

## Common Issues

### "Domain already in use"
- The domain might be claimed by another Vercel account
- Remove it from the old account first

### "Invalid Configuration"
- Make sure you removed any conflicting DNS records
- Delete any old A or CNAME records pointing elsewhere

### Still not working after 24 hours?
- Double-check the IP address: `76.76.21.21`
- Make sure there are no typos
- Check if your domain registrar has propagated the changes

## Registrar-Specific Guides

### GoDaddy
1. My Products → Domain → DNS
2. Add A Record with value `76.76.21.21`

### Namecheap
1. Domain List → Manage → Advanced DNS
2. Add A Record with value `76.76.21.21`

### Cloudflare
1. DNS → Add Record
2. Type: A, Name: @, IPv4: `76.76.21.21`
3. **Important:** Set Proxy status to "DNS only" (gray cloud)

## Need the Vercel Project URL?
Let me know and I can help you find your direct Vercel URL to test the site immediately!
