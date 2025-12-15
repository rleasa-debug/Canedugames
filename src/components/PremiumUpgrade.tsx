import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Button } from './ui/button';
import { Crown, X, TrendingUp, BarChart3, Clock, FileText, Users, Sparkles, ZapOff } from 'lucide-react';

interface PremiumUpgradeProps {
  onClose: () => void;
  accessToken?: string;
  feature?: string; // e.g., "progress", "report", "leaderboard", "ads"
}

export function PremiumUpgrade({ onClose, accessToken, feature }: PremiumUpgradeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!accessToken) {
      setError('Please sign in to upgrade');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/subscription/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          plan: 'yearly', // Only yearly plan now
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  const getFeatureText = () => {
    switch (feature) {
      case 'ads':
        return 'Remove all advertisements and enjoy an uninterrupted learning experience!';
      case 'progress':
        return 'Unlock detailed progress tracking to see your child\'s learning journey!';
      case 'report':
        return 'Unlock report cards to get printable progress summaries!';
      case 'leaderboard':
        return 'Unlock the leaderboard to see how your child compares with others!';
      default:
        return 'Unlock ad-free learning plus full progress tracking and analytics!';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl mb-3">Go Premium & Remove Ads!</h2>
          <p className="text-xl text-gray-600 mb-2">
            {getFeatureText()}
          </p>
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            ✅ All games are FREE forever!
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-300">
            <div className="flex items-start gap-3">
              <ZapOff className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">No Advertisements</p>
                <p className="text-sm text-gray-700">Completely ad-free experience for focused learning</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Progress Dashboard</p>
                <p className="text-sm text-gray-700">Track literacy & numeracy accuracy over time with beautiful charts</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Complete History</p>
                <p className="text-sm text-gray-700">See all past sessions, games played, and performance trends</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Printable Reports</p>
                <p className="text-sm text-gray-700">Download beautiful report cards to share with teachers</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 md:col-span-2">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Up to 5 Kids</p>
                <p className="text-sm text-gray-700">One family plan covers all your children's learning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing - Only Yearly */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-6 text-center border-2 border-yellow-300">
          <div className="mb-4">
            <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
              🎉 Best Value!
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-8 h-8 text-yellow-600" />
            <div className="text-5xl font-bold">$14.99</div>
          </div>
          <p className="text-gray-600 text-lg mb-3">
            per year • just $1.25/month!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>✨ Cancel anytime</span>
            <span>•</span>
            <span>🔒 Secure via Stripe</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700 mb-2">Free Plan</div>
              <div className="text-gray-600">✓ All 22 games</div>
              <div className="text-gray-600">✗ Ads displayed</div>
              <div className="text-gray-600">✗ No analytics</div>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-2 border-2 border-purple-300">
              <div className="font-semibold text-purple-700 mb-2">Premium</div>
              <div className="text-purple-600">✓ All 22 games</div>
              <div className="text-purple-600">✓ Ad-free experience</div>
              <div className="text-purple-600">✓ Full analytics</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <Button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <Crown className="w-5 h-5 mr-2 animate-pulse" />
              Redirecting to checkout...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Pay Now - $14.99/year
            </>
          )}
        </Button>

        <p className="text-center text-gray-500 mt-4 text-sm">
          🇨🇦 Supporting Canadian families with quality educational content
        </p>
      </div>
    </div>
  );
}