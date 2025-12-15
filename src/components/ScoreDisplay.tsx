import { Trophy, RotateCcw, Book, Calculator, TrendingUp, FileText, Crown, Lock } from "lucide-react";
import { useScore } from "../contexts/ScoreContext";
import { TextWithVoice } from "./TextWithVoice";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ProgressDashboard } from "./ProgressDashboard";
import { ReportCard } from "./ReportCard";
import { Leaderboard } from "./Leaderboard";
import { PremiumUpgrade } from "./PremiumUpgrade";
import { projectId } from "../utils/supabase/info";

interface ScoreDisplayProps {
  accessToken?: string;
  mobileBar?: boolean;
}

export function ScoreDisplay({ accessToken, mobileBar = false }: ScoreDisplayProps = {}) {
  const { literacyCorrect, literacyTotal, numeracyCorrect, numeracyTotal, resetScore } = useScore();
  const [showReset, setShowReset] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Check premium status on mount
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!accessToken) {
        setCheckingPremium(false);
        return;
      }

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/subscription/status`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      } finally {
        setCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [accessToken]);

  useEffect(() => {
    // Start the timer
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Reset timer when tab becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setElapsedSeconds(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const literacyPercentage = literacyTotal > 0 ? Math.round((literacyCorrect / literacyTotal) * 100) : 0;
  const numeracyPercentage = numeracyTotal > 0 ? Math.round((numeracyCorrect / numeracyTotal) * 100) : 0;

  // Handle clicking on locked features
  const handleFeatureClick = (feature: 'progress' | 'report' | 'leaderboard', setShowFunction: (value: boolean) => void) => {
    if (!isPremium) {
      setUpgradeFeature(feature);
      setShowUpgrade(true);
    } else {
      setShowFunction(true);
    }
  };

  // Mobile bar version - full width, no fixed positioning
  if (mobileBar) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Action Buttons Only - Labels are in App.tsx */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProgress(!showProgress)}
            className="p-1 h-6 w-6"
            title="View Progress Dashboard"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!isPremium) {
                setUpgradeFeature('report');
                setShowUpgrade(true);
              } else {
                setShowReportCard(!showReportCard);
              }
            }}
            className="p-1 h-6 w-6"
            title="View Report Card"
          >
            <FileText className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="p-1 h-6 w-6"
            title="View Leaderboard"
          >
            <Crown className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReset(!showReset)}
            className="p-1 h-6 w-6"
            title="Reset Score"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
        
        {showReset && (
          <div className="mt-2 bg-white rounded-lg shadow-lg p-3 border border-red-300">
            <p className="text-xs mb-2">
              <TextWithVoice>Reset your score?</TextWithVoice>
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  resetScore();
                  setShowReset(false);
                }}
              >
                <TextWithVoice>Yes</TextWithVoice>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReset(false);
                }}
              >
                <TextWithVoice>Cancel</TextWithVoice>
              </Button>
            </div>
          </div>
        )}

        {showProgress && (
          <ProgressDashboard onClose={() => setShowProgress(false)} accessToken={accessToken} />
        )}

        {showReportCard && (
          <ReportCard onClose={() => setShowReportCard(false)} />
        )}

        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}

        {showUpgrade && (
          <PremiumUpgrade
            onClose={() => setShowUpgrade(false)}
            feature={upgradeFeature}
            accessToken={accessToken}
          />
        )}
      </div>
    );
  }

  // Desktop version - fixed positioning in top-right
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg px-4 py-2 border-2 border-yellow-400">
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          {/* Header Section */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div className="text-sm sm:text-base font-semibold text-gray-700">
              <TextWithVoice>Accuracy</TextWithVoice>
            </div>
          </div>

          {/* Literacy Score */}
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <div className="text-sm sm:text-base text-blue-600 font-semibold">
              <TextWithVoice>{literacyCorrect}/{literacyTotal}</TextWithVoice>
              {literacyTotal > 0 && (
                <span className="ml-1.5">
                  <TextWithVoice>{literacyPercentage}%</TextWithVoice>
                </span>
              )}
            </div>
          </div>

          {/* Numeracy Score */}
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            <div className="text-sm sm:text-base text-red-600 font-semibold">
              <TextWithVoice>{numeracyCorrect}/{numeracyTotal}</TextWithVoice>
              {numeracyTotal > 0 && (
                <span className="ml-1.5">
                  <TextWithVoice>{numeracyPercentage}%</TextWithVoice>
                </span>
              )}
            </div>
          </div>

          {/* Timer Display */}
          <div 
            className="text-sm sm:text-base tracking-wider text-center px-3 py-1 bg-black text-white rounded font-mono"
            style={{ fontFamily: "'Courier New', monospace", letterSpacing: '0.15em' }}
          >
            {formatTime(elapsedSeconds)}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProgress(!showProgress)}
              className="p-1.5 h-7 w-7 sm:h-8 sm:w-8"
              title="View Progress Dashboard"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isPremium) {
                  setUpgradeFeature('report');
                  setShowUpgrade(true);
                } else {
                  setShowReportCard(!showReportCard);
                }
              }}
              className="p-1.5 h-7 w-7 sm:h-8 sm:w-8"
              title="View Report Card"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="p-1.5 h-7 w-7 sm:h-8 sm:w-8"
              title="View Leaderboard"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReset(!showReset)}
              className="p-1.5 h-7 w-7 sm:h-8 sm:w-8"
              title="Reset Score"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {showReset && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-3 border border-red-300">
          <p className="text-xs mb-2">
            <TextWithVoice>Reset your score?</TextWithVoice>
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                resetScore();
                setShowReset(false);
              }}
            >
              <TextWithVoice>Yes</TextWithVoice>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowReset(false);
              }}
            >
              <TextWithVoice>Cancel</TextWithVoice>
            </Button>
          </div>
        </div>
      )}

      {showProgress && (
        <ProgressDashboard onClose={() => setShowProgress(false)} accessToken={accessToken} />
      )}

      {showReportCard && (
        <ReportCard onClose={() => setShowReportCard(false)} />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {showUpgrade && (
        <PremiumUpgrade
          onClose={() => setShowUpgrade(false)}
          feature={upgradeFeature}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}