import { useEffect, useRef } from 'react';

/**
 * Media.net Ads (Yahoo/Bing Network)
 * 
 * Media.net is a GREAT Google AdSense alternative:
 * ✅ Powered by Yahoo & Bing
 * ✅ Easier approval than AdSense
 * ✅ High-quality contextual ads
 * ✅ Good for educational content
 * ✅ RPM: $5-12 (better than AdSense!)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up at: https://www.media.net/
 * 2. Fill out application with your website URL
 * 3. Wait 1-2 days for approval (usually MUCH faster than AdSense!)
 * 4. Once approved, go to "Setup" → "Ad Units" in dashboard
 * 5. Get your Customer ID (looks like: 8CU123456)
 * 6. Create an ad unit and get Ad Unit ID (looks like: 123456789)
 * 7. Replace the values below
 * 
 * TIPS FOR APPROVAL:
 * - Make sure you have at least 5-10 pages of content
 * - Content should be high-quality and original
 * - Site should be fully functional (no "under construction")
 * - Educational sites get approved easily!
 */

// ⚠️ REPLACE THESE WITH YOUR ACTUAL IDS AFTER SIGNING UP
const MEDIANET_CUSTOMER_ID = 'YOUR_CUSTOMER_ID'; // e.g., '8CU12345'
const MEDIANET_AD_UNIT_ID = 'YOUR_AD_UNIT_ID';   // e.g., '123456789'

declare global {
  interface Window {
    _mNHandle?: any;
    _mNDetails?: any;
  }
}

/**
 * Media.net Script Loader
 * Auto-loads the Media.net script when component mounts
 */
export function MediaNetScript() {
  useEffect(() => {
    // Don't load if not configured yet
    if (MEDIANET_CUSTOMER_ID === 'YOUR_CUSTOMER_ID') {
      if (process.env.NODE_ENV === 'development') {
        console.log('💡 Media.net not configured yet. Sign up at https://www.media.net/');
      }
      return;
    }

    // Check if script already loaded
    const existingScript = document.querySelector(
      `script[src*="contextual.media.net"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://contextual.media.net/dmedianet.js?cid=${MEDIANET_CUSTOMER_ID}`;
      script.async = true;
      
      script.onload = () => {
        console.log('✅ Media.net loaded successfully');
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Media.net script. Check your Customer ID.');
      };

      document.head.appendChild(script);
    }
  }, []);

  return null;
}

/**
 * Media.net Banner Ad Component
 * Shows a responsive banner ad for non-premium users
 */
interface MediaNetBannerProps {
  isPremium: boolean;
  position?: 'top' | 'bottom' | 'inline';
}

export function MediaNetBanner({ 
  isPremium,
  position = 'bottom'
}: MediaNetBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adIdRef = useRef(`medianet-${Date.now()}`);

  useEffect(() => {
    if (!isPremium && MEDIANET_CUSTOMER_ID !== 'YOUR_CUSTOMER_ID' && adRef.current) {
      try {
        // Initialize Media.net ad
        if (window._mNHandle && window._mNHandle.queue) {
          window._mNHandle.queue.push(() => {
            if (window._mNHandle.createAdUnit) {
              window._mNHandle.createAdUnit({
                adUnit: adRef.current,
                size: 'auto'
              });
            }
          });
        }
      } catch (error) {
        console.error('Media.net error:', error);
      }
    }
  }, [isPremium]);

  // Don't show for premium users
  if (isPremium) return null;

  // Show placeholder if not configured
  if (MEDIANET_CUSTOMER_ID === 'YOUR_CUSTOMER_ID') {
    return (
      <div className={`w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg p-6 my-4 ${
        position === 'bottom' ? 'fixed bottom-0 left-0 right-0 z-40' : ''
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💰 Media.net Ad Space Ready
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Sign up at <a href="https://www.media.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">media.net</a> to start earning!
          </p>
          <p className="text-xs text-gray-500">
            Expected: $5-12 per 1,000 visitors
          </p>
        </div>
      </div>
    );
  }

  const positionClasses = position === 'bottom' 
    ? 'fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg'
    : '';

  return (
    <div className={positionClasses}>
      <div className="max-w-7xl mx-auto p-2">
        <div 
          ref={adRef}
          id={adIdRef.current}
          data-cid={MEDIANET_CUSTOMER_ID}
          data-crid={MEDIANET_AD_UNIT_ID}
          className="w-full min-h-[90px] flex items-center justify-center"
        >
          {/* Media.net ad will load here */}
          <div className="text-xs text-gray-400">Advertisement</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Media.net Card Ad (for inline placement)
 * Perfect for placing between games or in content
 */
interface MediaNetCardProps {
  isPremium: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function MediaNetCard({ 
  isPremium,
  size = 'medium'
}: MediaNetCardProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adIdRef = useRef(`medianet-card-${Date.now()}`);

  useEffect(() => {
    if (!isPremium && MEDIANET_CUSTOMER_ID !== 'YOUR_CUSTOMER_ID' && adRef.current) {
      try {
        if (window._mNHandle && window._mNHandle.queue) {
          window._mNHandle.queue.push(() => {
            if (window._mNHandle.createAdUnit) {
              window._mNHandle.createAdUnit({
                adUnit: adRef.current,
                size: 'auto'
              });
            }
          });
        }
      } catch (error) {
        console.error('Media.net error:', error);
      }
    }
  }, [isPremium]);

  if (isPremium) return null;

  const sizeClasses = {
    small: 'min-h-[90px]',
    medium: 'min-h-[250px]',
    large: 'min-h-[280px]'
  };

  if (MEDIANET_CUSTOMER_ID === 'YOUR_CUSTOMER_ID') {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <div className="text-center text-xs text-gray-500">
          Media.net Ad Placeholder<br />
          Configure in /components/MediaNetAds.tsx
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 my-4">
      <div 
        ref={adRef}
        id={adIdRef.current}
        data-cid={MEDIANET_CUSTOMER_ID}
        data-crid={MEDIANET_AD_UNIT_ID}
        className={`w-full ${sizeClasses[size]} flex items-center justify-center`}
      >
        <div className="text-xs text-gray-400">Advertisement</div>
      </div>
    </div>
  );
}

/**
 * QUICK SETUP CHECKLIST:
 * 
 * ✅ Step 1: Sign up at https://www.media.net/
 * ✅ Step 2: Complete application (takes 5 minutes)
 * ✅ Step 3: Wait for approval (1-2 days usually)
 * ✅ Step 4: Get Customer ID from dashboard
 * ✅ Step 5: Create Ad Unit and get Ad Unit ID
 * ✅ Step 6: Replace values at top of this file
 * ✅ Step 7: Ads will automatically show to free users!
 * 
 * EARNINGS ESTIMATE:
 * - 1,000 visitors/month: $5-12/month
 * - 5,000 visitors/month: $25-60/month
 * - 10,000 visitors/month: $50-120/month
 * 
 * SUPPORT:
 * - Dashboard: https://www.media.net/dashboard
 * - Docs: https://www.media.net/adunits
 */