import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Crown, Sparkles, ZapOff, BarChart3, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface SubscriptionSuccessProps {
  onContinue: () => void;
}

export function SubscriptionSuccess({ onContinue }: SubscriptionSuccessProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg"
        >
          <CheckCircle className="w-14 h-14 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl mb-4"
        >
          🎉 Welcome to Premium!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-600 mb-8"
        >
          Your subscription is now active. Get ready for an ad-free learning experience with full analytics!
        </motion.p>

        {/* Premium Features Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-300">
            <div className="flex items-start gap-3">
              <ZapOff className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold mb-1">Ad-Free Experience</p>
                <p className="text-sm text-gray-700">No more interruptions!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold mb-1">Full Analytics</p>
                <p className="text-sm text-gray-700">Track all progress</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Crown className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold mb-1">Premium Member</p>
                <p className="text-sm text-gray-700">Exclusive features</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-pink-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold mb-1">Report Cards</p>
                <p className="text-sm text-gray-700">Printable summaries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-purple-600" />
            <p className="text-lg font-semibold text-gray-800">Premium Yearly Subscription</p>
          </div>
          <p className="text-gray-600 mb-2">$14.99 CAD per year</p>
          <p className="text-sm text-gray-500">Cancel anytime • Renews automatically</p>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gray-50 rounded-xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            What's Next?
          </h3>
          <div className="text-left text-sm text-gray-700 space-y-2">
            <p>✅ Ads are now removed from your account</p>
            <p>✅ Access analytics dashboard from the score bar</p>
            <p>✅ View detailed progress reports anytime</p>
            <p>✅ Manage your subscription in settings</p>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={onContinue}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Crown className="w-5 h-5 mr-2" />
            Start Learning (Redirecting in {countdown}s)
          </Button>
        </motion.div>

        <p className="text-sm text-gray-500 mt-4">
          Receipt sent to your email • Thank you for supporting Canadian education! 🇨🇦
        </p>
      </motion.div>
    </div>
  );
}
