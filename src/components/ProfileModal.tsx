import { useState, useEffect } from 'react';
import { X, Crown, Trophy, Target } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import { useScore } from '../contexts/ScoreContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function ProfileModal({ isOpen, onClose, isPremium, onUpgrade }: ProfileModalProps) {
  const [user, setUser] = useState<any>(null);
  const { stats, currentLevel } = useScore();

  useEffect(() => {
    if (isOpen) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const literacyAccuracy = stats.literacy.attempted > 0 
    ? Math.round((stats.literacy.correct / stats.literacy.attempted) * 100) 
    : 0;
  const numeracyAccuracy = stats.numeracy.attempted > 0 
    ? Math.round((stats.numeracy.correct / stats.numeracy.attempted) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Your Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>

            {/* Premium Status */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <>
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold">Premium Member</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold">Free Account</span>
                    </>
                  )}
                </div>
                {!isPremium && (
                  <button
                    onClick={onUpgrade}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Level {currentLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.stagesCompleted % 50) * 2}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.stagesCompleted % 50} / 50 stages completed
              </p>
            </div>

            {/* Stats */}
            {isPremium && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Literacy</p>
                  <p className="text-2xl text-blue-600">{literacyAccuracy}%</p>
                  <p className="text-xs text-gray-500">
                    {stats.literacy.correct} / {stats.literacy.attempted}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Numeracy</p>
                  <p className="text-2xl text-green-600">{numeracyAccuracy}%</p>
                  <p className="text-xs text-gray-500">
                    {stats.numeracy.correct} / {stats.numeracy.attempted}
                  </p>
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Upgrade to Premium to unlock detailed analytics and ad-free learning!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}