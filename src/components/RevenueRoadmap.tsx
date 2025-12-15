import { motion } from 'motion/react';
import { TrendingUp, Users, DollarSign, Target, Crown, Award } from 'lucide-react';

/**
 * Revenue Roadmap Component
 * 
 * Shows publishers which ad network to use based on traffic
 * Helps visualize the growth journey
 */

interface Milestone {
  visitors: number;
  label: string;
  network: string;
  rpm: string;
  monthlyRevenue: string;
  icon: any;
  color: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    visitors: 1000,
    label: 'Starting Out',
    network: 'Subscriptions + Media.net',
    rpm: '$5-12',
    monthlyRevenue: '$50-100',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description: 'Focus on subscriptions. Add Media.net for bonus revenue.'
  },
  {
    visitors: 5000,
    label: 'Growing',
    network: 'Subscriptions + Media.net + Amazon',
    rpm: '$8-15',
    monthlyRevenue: '$200-400',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    description: 'Optimize everything. Add affiliate marketing.'
  },
  {
    visitors: 10000,
    label: 'Established',
    network: 'Upgrade to Ezoic!',
    rpm: '$10-20',
    monthlyRevenue: '$500-1,000',
    icon: Target,
    color: 'from-pink-500 to-pink-600',
    description: 'Switch to Ezoic for 2x revenue boost!'
  },
  {
    visitors: 50000,
    label: 'Professional',
    network: 'Upgrade to Mediavine!',
    rpm: '$15-25',
    monthlyRevenue: '$2,000-4,000',
    icon: Award,
    color: 'from-orange-500 to-orange-600',
    description: 'Top-tier network. Maximum revenue!'
  }
];

interface RevenueRoadmapProps {
  currentVisitors: number;
}

export function RevenueRoadmap({ currentVisitors }: RevenueRoadmapProps) {
  const getCurrentMilestone = () => {
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (currentVisitors >= milestones[i].visitors) {
        return i;
      }
    }
    return 0;
  };

  const currentMilestoneIndex = getCurrentMilestone();
  const nextMilestone = milestones[Math.min(currentMilestoneIndex + 1, milestones.length - 1)];
  const progress = currentMilestoneIndex === milestones.length - 1 
    ? 100 
    : (currentVisitors / nextMilestone.visitors) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Revenue Roadmap</h2>
            <p className="text-sm text-gray-600">Your path to maximum ad revenue</p>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Monthly Visitors</p>
              <p className="text-3xl font-bold text-gray-800">
                {currentVisitors.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Current Stage</p>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {milestones[currentMilestoneIndex].label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      {currentMilestoneIndex < milestones.length - 1 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Progress to {nextMilestone.label}
            </p>
            <p className="text-sm font-bold text-purple-600">
              {Math.min(progress, 100).toFixed(0)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {nextMilestone.visitors - currentVisitors > 0 
              ? `${(nextMilestone.visitors - currentVisitors).toLocaleString()} more visitors to unlock ${nextMilestone.network}!`
              : 'You can upgrade now!'}
          </p>
        </div>
      )}

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          const isComplete = currentVisitors >= milestone.visitors;
          const isCurrent = index === currentMilestoneIndex;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border-2 rounded-xl p-4 transition-all ${
                isCurrent
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                  : isComplete
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Completion Badge */}
              {isComplete && !isCurrent && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                  YOU ARE HERE
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${milestone.color} rounded-xl flex items-center justify-center flex-shrink-0 ${
                  !isComplete && !isCurrent ? 'opacity-40' : ''
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">
                      {milestone.visitors.toLocaleString()} Visitors/Month
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isCurrent 
                        ? 'bg-purple-200 text-purple-800'
                        : isComplete
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {milestone.label}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {milestone.network}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {milestone.description}
                  </p>

                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">RPM:</span>{' '}
                      <span className="font-semibold text-gray-700">{milestone.rpm}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly:</span>{' '}
                      <span className="font-semibold text-green-600">{milestone.monthlyRevenue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          💡 Current Recommendation:
        </p>
        <p className="text-sm text-gray-700">
          {milestones[currentMilestoneIndex].description}
        </p>
        {currentMilestoneIndex < milestones.length - 1 && (
          <p className="text-xs text-gray-600 mt-2">
            Next upgrade at {nextMilestone.visitors.toLocaleString()} visitors → {nextMilestone.network}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import { RevenueRoadmap } from './components/RevenueRoadmap';
 * 
 * // In your analytics/dashboard page:
 * <RevenueRoadmap currentVisitors={1250} />
 * 
 * This will show:
 * - Current milestone
 * - Progress to next milestone
 * - Revenue potential at each level
 * - Which ad network to use
 */
