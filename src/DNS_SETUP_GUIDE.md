# How to Fix "Server IP Address Could Not Be Found" (DNS Error)

This error (`ERR_NAME_NOT_RESOLVED`) means your domain name (`canedugames.com`) is not connected to Vercel properly. It is **not** a bug in the code. It is like having a house but no address in the phone book.

## Step 1: Verify the App Works
First, prove that the code is working by visiting the **Vercel Subdomain**.
1. Go to your Vercel Dashboard.
2. Click on your project.
3. Under "Domains", click the link that ends in `.vercel.app` (e.g., `can-edu-games.vercel.app`).
   - **If this loads:** Your app is perfect! You just need to fix the domain connection (Step 2).
   - **If this fails:** Then we have a code issue.

## Step 2: Fix the Domain Connection
If you own `canedugames.com`, you need to tell your registrar (where you bought the domain, e.g., GoDaddy, Namecheap) to point to Vercel.

### Option A: Change Nameservers (Easiest for Vercel)
1. Go to your Domain Registrar.
2. Find **Nameservers**.
3. Change them to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

### Option B: A Records (If you want to keep email/other settings)
1. Go to your Domain Registrar > **DNS Management**.
2. Create/Edit the **A Record**:
   - **Type:** A
   - **Name/Host:** @
   - **Value:** `76.76.21.21`
3. Create/Edit the **CNAME Record**:
   - **Type:** CNAME
   - **Name/Host:** www
   - **Value:** `cname.vercel-dns.com`

## Step 3: Check Vercel Settings
1. Go to Vercel Project > **Settings** > **Domains**.
2. Make sure `canedugames.com` and `www.canedugames.com` are listed.
3. If they have a Red Error, click "View Error" to see what is missing.
