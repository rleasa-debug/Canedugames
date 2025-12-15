import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Eye, MousePointer, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Ad Revenue Tracker Component
 * 
 * Helps you visualize potential earnings and track progress
 * Encourages you to check Media.net dashboard
 */

interface AdRevenueTrackerProps {
  monthlyVisitors?: number; // Actual traffic from analytics
}

export function AdRevenueTracker({ monthlyVisitors = 0 }: AdRevenueTrackerProps) {
  const [estimatedVisitors, setEstimatedVisitors] = useState(monthlyVisitors || 1000);
  const [rpm, setRpm] = useState(8); // Average RPM for educational sites

  // Calculate earnings
  const monthlyEarnings = (estimatedVisitors / 1000) * rpm;
  const yearlyEarnings = monthlyEarnings * 12;

  // Subscription revenue (assuming 5% conversion)
  const subscriptionConversions = Math.floor(estimatedVisitors * 0.05);
  const subscriptionMonthlyRevenue = (subscriptionConversions * 14.99) / 12;
  const totalMonthlyRevenue = monthlyEarnings + subscriptionMonthlyRevenue;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Revenue Tracker</h2>
            <p className="text-sm text-gray-600">Media.net + Subscriptions</p>
          </div>
        </div>
        <a
          href="https://www.media.net/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View Dashboard
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Traffic Input */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Visitors
        </label>
        <input
          type="range"
          min="100"
          max="50000"
          step="100"
          value={estimatedVisitors}
          onChange={(e) => setEstimatedVisitors(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-lg font-bold text-purple-600">
            {estimatedVisitors.toLocaleString()} visitors
          </span>
          <span className="text-sm text-gray-600">
            {monthlyVisitors > 0 ? `Actual: ${monthlyVisitors.toLocaleString()}` : 'Estimate'}
          </span>
        </div>
      </div>

      {/* RPM Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          RPM (Revenue per 1,000 views)
        </label>
        <div className="flex gap-2">
          {[5, 8, 12].map((value) => (
            <button
              key={value}
              onClick={() => setRpm(value)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                rpm === value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              ${value}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {rpm === 5 && '💡 Conservative estimate - typical for new sites'}
          {rpm === 8 && '✅ Average for educational content - most likely!'}
          {rpm === 12 && '🎯 High performance - possible with optimization'}
        </p>
      </div>

      {/* Revenue Breakdown */}
      <div className="space-y-4">
        {/* Media.net Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">Media.net Ads</span>
            </div>
            <span className="text-sm text-gray-600">{estimatedVisitors.toLocaleString()} views</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              ${monthlyEarnings.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            At ${rpm} RPM for {(estimatedVisitors / 1000).toFixed(1)}k impressions
          </p>
        </motion.div>

        {/* Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-700">Subscriptions</span>
            </div>
            <span className="text-sm text-gray-600">
              {subscriptionConversions} @ $14.99/year
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">
              ${subscriptionMonthlyRevenue.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Assuming 5% conversion rate from visitors
          </p>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 font-semibold">Total Monthly Revenue</span>
            <MousePointer className="w-5 h-5 text-white/80" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-white">
              ${totalMonthlyRevenue.toFixed(2)}
            </span>
            <span className="text-sm text-white/90">/month</span>
          </div>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <span>Yearly Projection:</span>
            <span className="font-bold text-lg">${(totalMonthlyRevenue * 12).toFixed(2)}</span>
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Next Milestone
        </h3>
        
        {estimatedVisitors < 5000 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Progress to 5,000 visitors</span>
              <span className="font-semibold text-orange-600">
                {((estimatedVisitors / 5000) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(estimatedVisitors / 5000) * 100}%` }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600">
              At 5k visitors: ${((5000 / 1000) * rpm + (250 * 14.99 / 12)).toFixed(2)}/month
            </p>
          </div>
        )}

        {estimatedVisitors >= 5000 && estimatedVisitors < 10000 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Progress to 10,000 visitors (Ezoic eligible!)</span>
              <span className="font-semibold text-orange-600">
                {((estimatedVisitors / 10000) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(estimatedVisitors / 10000) * 100}%` }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600">
              At 10k visitors: Switch to Ezoic for $100-200/month! 🚀
            </p>
          </div>
        )}

        {estimatedVisitors >= 10000 && estimatedVisitors < 50000 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Progress to 50,000 visitors (Mediavine!)</span>
              <span className="font-semibold text-orange-600">
                {((estimatedVisitors / 50000) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(estimatedVisitors / 50000) * 100}%` }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600">
              At 50k visitors: Switch to Mediavine for $1,000-2,000/month! 🎉
            </p>
          </div>
        )}

        {estimatedVisitors >= 50000 && (
          <div className="text-center">
            <p className="text-lg font-bold text-green-600 mb-1">
              🎉 You've made it! Apply to Mediavine!
            </p>
            <p className="text-xs text-gray-600">
              Premium ad network with highest RPMs available
            </p>
            <a
              href="https://www.mediavine.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block"
            >
              <Button className="bg-green-600 hover:bg-green-700">
                Apply to Mediavine
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700">
          <strong>💡 Pro Tip:</strong> Your subscription model earns{' '}
          <strong className="text-purple-600">
            {subscriptionMonthlyRevenue > monthlyEarnings ? 'more' : 'about the same'}
          </strong>{' '}
          as ads! Focus on converting visitors to premium while ads provide bonus revenue.
        </p>
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import { AdRevenueTracker } from './components/AdRevenueTracker';
 * 
 * // In your dashboard or analytics page:
 * <AdRevenueTracker monthlyVisitors={1250} />
 * 
 * // Or without actual data (shows estimator):
 * <AdRevenueTracker />
 */
