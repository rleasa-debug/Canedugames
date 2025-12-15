import { useEffect } from 'react';

/**
 * PropellerAds Script Loader
 * 
 * PropellerAds is MUCH EASIER than Google AdSense:
 * ✅ Instant approval (no waiting!)
 * ✅ Works with low traffic sites
 * ✅ Good for educational content
 * 
 * SETUP (5 minutes):
 * 1. Sign up at: https://propellerads.com/
 * 2. Choose "Publisher" account type
 * 3. Add your website URL
 * 4. Get instant approval!
 * 5. Go to "Websites" → "Add Site" → Get your Zone IDs
 * 6. Replace ZONE_ID below with your actual Zone ID
 */

const PROPELLER_ZONE_ID = 'YOUR_ZONE_ID_HERE'; // Replace with your Zone ID

export function PropellerAdsScript() {
  useEffect(() => {
    if (PROPELLER_ZONE_ID === 'YOUR_ZONE_ID_HERE') {
      if (process.env.NODE_ENV === 'development') {
        console.log('💡 PropellerAds not configured yet. Sign up at https://propellerads.com/');
      }
      return;
    }

    // Check if script already loaded
    const existingScript = document.querySelector(
      `script[src*="propellerads.com"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = `https://www.profitabledisplaynetwork.com/${PROPELLER_ZONE_ID}/invoke.js`;
      
      script.onload = () => {
        console.log('✅ PropellerAds loaded');
      };
      
      script.onerror = () => {
        console.error('Failed to load PropellerAds script.');
      };

      document.body.appendChild(script);
    }
  }, []);

  return null;
}

/**
 * PropellerAds Banner Component
 */
export function PropellerBannerAd({ 
  isPremium, 
  zoneId = PROPELLER_ZONE_ID 
}: { 
  isPremium: boolean;
  zoneId?: string;
}) {
  useEffect(() => {
    if (!isPremium && zoneId !== 'YOUR_ZONE_ID_HERE') {
      // Initialize PropellerAds ad
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = `https://www.profitabledisplaynetwork.com/${zoneId}/invoke.js`;
      
      const container = document.getElementById(`propeller-${zoneId}`);
      if (container) {
        container.appendChild(script);
      }
    }
  }, [isPremium, zoneId]);

  if (isPremium) return null;

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 flex items-center justify-center min-h-[90px]">
      <div id={`propeller-${zoneId}`} className="w-full flex justify-center" />
    </div>
  );
}
