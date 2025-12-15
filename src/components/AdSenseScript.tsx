import { useEffect } from 'react';

/**
 * Google AdSense Script Loader
 * 
 * This component loads the Google AdSense script dynamically.
 * 
 * SETUP:
 * 1. Replace YOUR_PUBLISHER_ID below with your actual AdSense Publisher ID
 *    (looks like: ca-pub-1234567890123456)
 * 2. Import this component in App.tsx
 * 3. Add it once at the root level: <AdSenseScript />
 */

const ADSENSE_PUBLISHER_ID = 'ca-pub-6006974250173608'; // ✅ CONFIGURED!

export function AdSenseScript() {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );

    if (!existingScript) {
      // Only load if Publisher ID has been set
      if (ADSENSE_PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX') {
        // Silently skip AdSense loading until configured
        // To configure: Update ADSENSE_PUBLISHER_ID in this file after signing up at https://adsense.google.com
        if (process.env.NODE_ENV === 'development') {
          console.log('💡 AdSense not configured yet. See /ADSENSE_SETUP_GUIDE.md when ready.');
        }
        return;
      }

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onerror = () => {
        console.error('Failed to load AdSense script. Check your Publisher ID.');
      };

      document.head.appendChild(script);
      
      console.log('✅ AdSense script loaded');
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Ad Status Checker (for debugging)
 * Shows whether AdSense is properly configured
 */
export function AdSenseStatus() {
  const isConfigured = ADSENSE_PUBLISHER_ID !== 'ca-pub-XXXXXXXXXXXXXXXX';

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-xs shadow-lg">
      <div className="font-bold mb-1">🎯 AdSense Status:</div>
      {isConfigured ? (
        <div className="text-green-400">
          ✅ Publisher ID configured<br />
          ID: {ADSENSE_PUBLISHER_ID}
        </div>
      ) : (
        <div className="text-yellow-400">
          ⚠️ Not configured yet<br />
          Update ADSENSE_PUBLISHER_ID in AdSenseScript.tsx
        </div>
      )}
    </div>
  );
}