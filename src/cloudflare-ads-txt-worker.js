/**
 * Cloudflare Worker for serving ads.txt file
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to Cloudflare Dashboard: https://dash.cloudflare.com
 * 2. Select "Workers & Pages" from left sidebar
 * 3. Click "Create Worker"
 * 4. Name it: "ads-txt-worker"
 * 5. Copy and paste this ENTIRE code into the editor
 * 6. Click "Deploy"
 * 
 * THEN SET UP THE ROUTE:
 * 
 * 7. Go to "Workers Routes" tab
 * 8. Click "Add route"
 * 9. Route: www.canedugames.com/ads.txt
 * 10. Worker: ads-txt-worker
 * 11. Click "Save"
 * 
 * TEST IT:
 * 
 * 12. Visit: https://www.canedugames.com/ads.txt
 * 13. You should see: google.com, pub-6006974250173608, DIRECT, f08c47fec0942fa0
 * 
 * ✅ DONE! Google can now verify your ads.txt file!
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve ads.txt file for AdSense
    if (url.pathname === '/ads.txt') {
      return new Response(
        'google.com, pub-6006974250173608, DIRECT, f08c47fec0942fa0',
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          },
        }
      );
    }
    
    // For all other requests, pass through to origin
    return fetch(request);
  },
};
