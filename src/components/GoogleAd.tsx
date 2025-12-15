import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Google AdSense Component
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up for Google AdSense: https://www.google.com/adsense/
 * 2. Add your site and wait for approval (1-2 weeks)
 * 3. Once approved, get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 4. Add the AdSense script to /index.html in the <head> section:
 * 
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *         crossorigin="anonymous"></script>
 * 
 * 5. Create ad units in AdSense dashboard and use the slot IDs below
 * 6. IMPORTANT: Enable "Family-friendly" ads in AdSense settings for kids' content
 */
export function GoogleAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = {},
  className = ''
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Push ad to Google AdSense
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}

/**
 * Pre-configured ad components for common placements
 */

// Banner ad (top/bottom of page)
export function BannerAd({ isPremium }: { isPremium: boolean }) {
  if (isPremium) return null;

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 flex items-center justify-center min-h-[90px]">
      <GoogleAd 
        slot="1234567890" // Replace with your ad slot ID
        format="horizontal"
        style={{ minHeight: '90px', width: '100%' }}
      />
    </div>
  );
}

// Square ad (sidebar or in-content)
export function SquareAd({ isPremium }: { isPremium: boolean }) {
  if (isPremium) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 flex items-center justify-center min-h-[250px]">
      <GoogleAd 
        slot="0987654321" // Replace with your ad slot ID
        format="rectangle"
        style={{ width: '300px', height: '250px' }}
      />
    </div>
  );
}

// Responsive in-feed ad
export function InFeedAd({ isPremium }: { isPremium: boolean }) {
  if (isPremium) return null;

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
      <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
      <GoogleAd 
        slot="1122334455" // Replace with your ad slot ID
        format="auto"
        responsive={true}
      />
    </div>
  );
}
