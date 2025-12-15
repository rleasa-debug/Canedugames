import { TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface UpgradeBannerProps {
  onUpgradeClick: () => void;
}

export function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has dismissed the banner
    return localStorage.getItem('upgrade_banner_dismissed') === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('upgrade_banner_dismissed', 'true');
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl w-full px-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-4 md:p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-12 h-12 bg-white/20 rounded-full items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1">
              Want to see your child's progress?
            </h3>
            <p className="text-sm text-purple-100">
              Unlock detailed analytics, progress tracking, and printable reports for just $7.99/month
            </p>
          </div>

          <Button
            onClick={onUpgradeClick}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-6 flex-shrink-0"
          >
            Unlock
          </Button>
        </div>
      </div>
    </div>
  );
}
