import { AdBanner, AdCard, AdSquare } from './AdBanner';

/**
 * Universal Ad Component
 * 
 * Easy way to switch between different ad networks or upgrade prompts
 * 
 * USAGE:
 * <UniversalAd 
 *   isPremium={isPremium} 
 *   onUpgradeClick={handleUpgrade}
 *   network="upgrade-prompt"  // or "medianet" or "propellerads"
 * />
 */

type AdNetwork = 'upgrade-prompt' | 'medianet' | 'propellerads' | 'none';

interface UniversalAdProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
  network?: AdNetwork;
  position?: 'top' | 'bottom' | 'inline' | 'card' | 'square';
  size?: 'small' | 'medium' | 'large';
}

export function UniversalAd({ 
  isPremium, 
  onUpgradeClick, 
  network = 'upgrade-prompt',
  position = 'bottom',
  size = 'medium'
}: UniversalAdProps) {
  
  // Don't show anything for premium users
  if (isPremium) {
    return null;
  }

  // Don't show if network is set to 'none'
  if (network === 'none') {
    return null;
  }

  // Render based on network choice
  switch (network) {
    case 'upgrade-prompt':
      // Show upgrade prompt (your current implementation)
      if (position === 'card') {
        return <AdCard isPremium={isPremium} onUpgradeClick={onUpgradeClick} />;
      }
      if (position === 'square') {
        return <AdSquare isPremium={isPremium} onUpgradeClick={onUpgradeClick} size={size} />;
      }
      return <AdBanner isPremium={isPremium} onUpgradeClick={onUpgradeClick} position={position} />;
    
    case 'medianet':
      // Media.net ads (Yahoo/Bing network)
      return (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 flex items-center justify-center min-h-[90px]">
          <div className="text-gray-500 text-xs text-center">
            📝 Media.net Ad Space<br />
            <span className="text-xs">Configure in /components/MediaNetAds.tsx</span>
          </div>
        </div>
      );
    
    case 'propellerads':
      // PropellerAds
      return (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 flex items-center justify-center min-h-[90px]">
          <div className="text-gray-500 text-xs text-center">
            🚀 PropellerAds Space<br />
            <span className="text-xs">Configure in /components/PropellerAdsScript.tsx</span>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}

/**
 * QUICK SETUP GUIDE
 * 
 * 1. UPGRADE PROMPTS (Default - Already Working!)
 *    <UniversalAd isPremium={isPremium} onUpgradeClick={handleUpgrade} />
 * 
 * 2. MEDIA.NET (Recommended Alternative to AdSense)
 *    - Sign up: https://www.media.net/
 *    - Get Customer ID and Ad Unit ID
 *    - Update /components/MediaNetAds.tsx
 *    - Change to: <UniversalAd network="medianet" ... />
 * 
 * 3. PROPELLERADS (Instant Approval)
 *    - Sign up: https://propellerads.com/
 *    - Get Zone ID
 *    - Update /components/PropellerAdsScript.tsx
 *    - Change to: <UniversalAd network="propellerads" ... />
 * 
 * 4. HIDE ADS
 *    - Change to: <UniversalAd network="none" ... />
 */

// Configuration helper - change this to switch all ads at once
export const DEFAULT_AD_NETWORK: AdNetwork = 'upgrade-prompt';

/**
 * Example usage in App.tsx:
 * 
 * import { UniversalAd, DEFAULT_AD_NETWORK } from './components/UniversalAd';
 * 
 * // Bottom banner
 * <UniversalAd 
 *   isPremium={isPremium} 
 *   onUpgradeClick={() => setShowUpgrade(true)}
 *   network={DEFAULT_AD_NETWORK}
 *   position="bottom"
 * />
 * 
 * // Card in content
 * <UniversalAd 
 *   isPremium={isPremium} 
 *   onUpgradeClick={() => setShowUpgrade(true)}
 *   network={DEFAULT_AD_NETWORK}
 *   position="card"
 * />
 */
