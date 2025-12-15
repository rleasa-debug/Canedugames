import { useEffect, useRef } from 'react';

/**
 * Google AdSense Integration
 * 
 * ✅ CONFIGURED with client ID: ca-pub-6006974250173608
 * ✅ Shows ads to FREE users only
 * ✅ Premium subscribers get ad-free experience
 * ✅ Responsive banner ads
 * 
 * AdSense Benefits:
 * ✅ Most trusted ad network
 * ✅ Reliable payments
 * ✅ Family-friendly ads
 * ✅ Great for educational content
 * ✅ RPM: $3-10 (depending on traffic)
 */

const ADSENSE_CLIENT_ID = 'ca-pub-6006974250173608';

// 🔑 IMPORTANT: Get your verification meta tag from AdSense
// Go to: https://adsense.google.com → Sites → Add site
// Google will provide a meta tag like: <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">
// Paste ONLY the content value below (without quotes):
const ADSENSE_META_VERIFICATION = 'ca-pub-6006974250173608';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

/**
 * AdSense Script Loader
 * Loads the Google AdSense script once when app starts
 * Also adds meta verification tag for site ownership
 */
export function AdSenseScript() {
  useEffect(() => {
    // Add meta tag for AdSense verification
    const metaTag = document.querySelector('meta[name="google-adsense-account"]');
    if (!metaTag) {
      const meta = document.createElement('meta');
      meta.name = 'google-adsense-account';
      meta.content = ADSENSE_META_VERIFICATION;
      document.head.appendChild(meta);
      console.log('✅ AdSense meta verification tag added');
    }

    // Check if script already loaded
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('✅ Google AdSense loaded successfully');
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load AdSense script');
      };

      document.head.appendChild(script);
    }
  }, []);

  return null;
}

/**
 * AdSense Banner Ad Component
 * Shows a responsive banner ad for non-premium users
 */
interface AdSenseBannerProps {
  isPremium: boolean;
  position?: 'top' | 'bottom' | 'inline';
}

export function AdSenseBanner({ 
  isPremium,
  position = 'bottom'
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (!isPremium && adRef.current && !isAdPushed.current) {
      try {
        // Initialize AdSense ad
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isAdPushed.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isPremium]);

  // Don't show for premium users
  if (isPremium) return null;

  const positionClasses = position === 'bottom' 
    ? 'fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200'
    : '';

  return (
    <div className={positionClasses}>
      <div className="max-w-7xl mx-auto p-2">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 mb-1">Advertisement</p>
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * AdSense Card Ad (for inline placement)
 * Perfect for placing between games or in content
 */
interface AdSenseCardProps {
  isPremium: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function AdSenseCard({ 
  isPremium,
  size = 'medium'
}: AdSenseCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (!isPremium && adRef.current && !isAdPushed.current) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isAdPushed.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isPremium]);

  if (isPremium) return null;

  const sizeClasses = {
    small: 'min-h-[90px]',
    medium: 'min-h-[250px]',
    large: 'min-h-[280px]'
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 my-4">
      <div className="text-center">
        <p className="text-[10px] text-gray-400 mb-2">Advertisement</p>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

/**
 * SETUP STATUS: ✅ COMPLETE!
 * 
 * Your AdSense is ready to go:
 * ✅ Client ID: ca-pub-6006974250173608
 * ✅ Shows to free users only
 * ✅ Premium users get ad-free experience
 * ✅ Responsive ads
 * 
 * NEXT STEPS:
 * 1. Make sure your site is live and accessible
 * 2. AdSense will review your site (can take a few days)
 * 3. Once approved, ads will start showing automatically
 * 4. Check earnings in AdSense dashboard: https://adsense.google.com
 * 
 * EARNINGS ESTIMATE:
 * - 1,000 visitors/month: $3-10/month
 * - 5,000 visitors/month: $15-50/month
 * - 10,000 visitors/month: $30-100/month
 * 
 * 💡 TIP: Revenue grows significantly with more traffic!
 */