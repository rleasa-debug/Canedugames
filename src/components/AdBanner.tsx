import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown } from 'lucide-react';
import { Button } from './ui/button';

// Google AdSense integration
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  onUpgradeClick: () => void;
  isPremium: boolean;
  position?: 'top' | 'bottom' | 'inline';
  useRealAds?: boolean; // Toggle between real ads and upgrade prompts
}

export function AdBanner({ onUpgradeClick, isPremium, position = 'bottom', useRealAds = false }: AdBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  // Don't show if minimized
  if (isMinimized) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className={`fixed ${position === 'top' ? 'top-20' : 'bottom-4'} right-4 z-40 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors`}
      >
        <Crown className="w-5 h-5" />
      </motion.button>
    );
  }

  const positionClasses = {
    top: 'fixed top-16 left-0 right-0 z-40',
    bottom: 'fixed bottom-0 left-0 right-0 z-40',
    inline: 'relative w-full'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0 }}
        className={positionClasses[position]}
      >
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-3 relative">
            <div className="flex items-center justify-between gap-4">
              {/* Ad Content */}
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold text-sm sm:text-base">
                    Remove ads & unlock analytics for just $14.99/year!
                  </span>
                </div>
                <Button
                  onClick={onUpgradeClick}
                  variant="outline"
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-purple-50 border-white font-semibold"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Go Premium
                </Button>
              </div>

              {/* Close button */}
              {position !== 'inline' && (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Minimize ad"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Animated border */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="h-1 w-full"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Inline Ad Card Component (for between games or in content)
interface AdCardProps {
  onUpgradeClick: () => void;
  isPremium: boolean;
}

export function AdCard({ onUpgradeClick, isPremium }: AdCardProps) {
  if (isPremium) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg my-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Love Learning Without Interruptions?
            </h3>
            <p className="text-gray-600 text-sm">
              Remove ads and get full analytics for just $14.99/year
            </p>
          </div>
        </div>
        <Button
          onClick={onUpgradeClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 whitespace-nowrap"
        >
          <Crown className="w-4 h-4 mr-2" />
          Go Premium
        </Button>
      </div>
    </motion.div>
  );
}

// Square Ad Placeholder (for game screens)
interface AdSquareProps {
  onUpgradeClick: () => void;
  isPremium: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function AdSquare({ onUpgradeClick, isPremium, size = 'medium' }: AdSquareProps) {
  if (isPremium) {
    return null;
  }

  const sizeClasses = {
    small: 'w-full max-w-xs h-24',
    medium: 'w-full max-w-md h-32',
    large: 'w-full max-w-2xl h-48'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${sizeClasses[size]} bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 my-4`}
    >
      <div className="text-gray-500 text-sm text-center px-4">
        <Crown className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="mb-2">Advertisement Space</p>
        <button
          onClick={onUpgradeClick}
          className="text-purple-600 hover:text-purple-700 font-semibold underline text-xs"
        >
          Remove ads for $14.99/year
        </button>
      </div>
    </motion.div>
  );
}