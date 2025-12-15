import { Award, Star, TrendingUp, X } from 'lucide-react';
import { TextWithVoice } from './TextWithVoice';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface LevelUpModalProps {
  newLevel: number;
  onContinue: () => void;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, onContinue, onClose }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative overflow-hidden">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <Award className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              <TextWithVoice>Level Up!</TextWithVoice>
            </h2>
            <p className="text-xl opacity-90">
              <TextWithVoice>Congratulations!</TextWithVoice>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-4">
              <Star className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <div className="text-sm text-gray-600">
                  <TextWithVoice>Now Playing</TextWithVoice>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  <TextWithVoice>Level {newLevel}</TextWithVoice>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              <TextWithVoice>
                You've demonstrated proficiency and unlocked Level {newLevel} content!
              </TextWithVoice>
            </p>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-left">
                  <p className="font-semibold text-yellow-900 mb-1">
                    <TextWithVoice>New Challenge Level</TextWithVoice>
                  </p>
                  <p className="text-yellow-800">
                    <TextWithVoice>
                      Get ready for more advanced Level {newLevel} curriculum content. 
                      Complete 50 stages with 77% accuracy to unlock Level {newLevel + 1}!
                    </TextWithVoice>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <TextWithVoice>Continue Playing</TextWithVoice>
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              <TextWithVoice>Back to Menu</TextWithVoice>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}