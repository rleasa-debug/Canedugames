import { useState, useEffect } from 'react';
import { useProgression } from '../contexts/ProgressionContext';
import { projectId } from '../utils/supabase/info';
import { X, Calendar, TrendingUp, Clock, Book, Calculator, Trophy, Star, Target } from 'lucide-react';
import { Button } from './ui/button';
import { TextWithVoice } from './TextWithVoice';

interface DayScore {
  date: string;
  literacyCorrect: number;
  literacyTotal: number;
  numeracyCorrect: number;
  numeracyTotal: number;
  timeSpent: number;
}

// Game information with nice icons and colors
const gameInfo: Record<string, { name: string; emoji: string; color: string }> = {
  reading: { name: "Rocky Mountain Reading", emoji: "📚", color: "blue" },
  typing: { name: "Typing on the Tundra", emoji: "⌨️", color: "green" },
  spelling: { name: "Spelling in Spruce Forest", emoji: "✨", color: "purple" },
  math: { name: "Canadian Shield Counting", emoji: "🔢", color: "red" },
  timestables: { name: "Times Tables Toronto", emoji: "⏰", color: "orange" },
  pattern: { name: "Patterns on Prairies", emoji: "🔢", color: "teal" },
  shapecomparison: { name: "Shape Sorting Saguenay", emoji: "🔺", color: "cyan" },
  geography: { name: "Great Lakes Geography", emoji: "🌍", color: "emerald" },
  phonics: { name: "Phonics by Pacific", emoji: "🔊", color: "pink" },
  rhyming: { name: "Rhyming on Rivers", emoji: "🎵", color: "indigo" },
  sentence: { name: "Saskatchewan Sentences", emoji: "⭐", color: "yellow" },
  prefixsuffix: { name: "Prefix & Suffix", emoji: "📖", color: "violet" },
  story: { name: "Story Time North", emoji: "📖", color: "violet" },
  mapleleaf: { name: "Maple Leaf Mapping", emoji: "🗺️", color: "red" },
  ispy: { name: "I Spy Words", emoji: "🔍", color: "amber" },
  vowelsounds: { name: "Vowel Sounds Sorting", emoji: "🔤", color: "purple" },
  anglebisector: { name: "Angle Bisector Challenge", emoji: "📐", color: "green" },
};

export function ProgressDashboard({ onClose, accessToken }: { onClose: () => void; accessToken?: string }) {
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel 
  } = useProgression();
  const [scores, setScores] = useState<DayScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'games' | 'history'>('games');

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/scores`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const { scores } = await response.json();
        setScores(scores);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const calculatePercentage = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const totalStats = scores.reduce((acc, score) => ({
    literacyCorrect: acc.literacyCorrect + score.literacyCorrect,
    literacyTotal: acc.literacyTotal + score.literacyTotal,
    numeracyCorrect: acc.numeracyCorrect + score.numeracyCorrect,
    numeracyTotal: acc.numeracyTotal + score.numeracyTotal,
    timeSpent: acc.timeSpent + score.timeSpent,
  }), {
    literacyCorrect: 0,
    literacyTotal: 0,
    numeracyCorrect: 0,
    numeracyTotal: 0,
    timeSpent: 0,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h2 className="text-2xl">
                <TextWithVoice>Your Progress</TextWithVoice>
              </h2>
              <p className="text-blue-100 text-sm">
                <TextWithVoice>Track your learning journey</TextWithVoice>
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Overall Stats */}
        <div className="p-6 bg-gray-50 border-b grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Book className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">
              <TextWithVoice>Literacy</TextWithVoice>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              <TextWithVoice>
                {calculatePercentage(totalStats.literacyCorrect, totalStats.literacyTotal)}%
              </TextWithVoice>
            </div>
            <div className="text-xs text-gray-500">
              <TextWithVoice>
                {totalStats.literacyCorrect}/{totalStats.literacyTotal} correct
              </TextWithVoice>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Calculator className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">
              <TextWithVoice>Numeracy</TextWithVoice>
            </div>
            <div className="text-2xl font-bold text-green-600">
              <TextWithVoice>
                {calculatePercentage(totalStats.numeracyCorrect, totalStats.numeracyTotal)}%
              </TextWithVoice>
            </div>
            <div className="text-xs text-gray-500">
              <TextWithVoice>
                {totalStats.numeracyCorrect}/{totalStats.numeracyTotal} correct
              </TextWithVoice>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">
              <TextWithVoice>Total Time</TextWithVoice>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              <TextWithVoice>{formatTime(totalStats.timeSpent)}</TextWithVoice>
            </div>
            <div className="text-xs text-gray-500">
              <TextWithVoice>Across {scores.length} days</TextWithVoice>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6 bg-gray-50 border-b flex items-center justify-between">
          <Button
            onClick={() => setActiveTab('games')}
            variant="ghost"
            size="sm"
            className={`text-gray-700 hover:bg-gray-200 ${
              activeTab === 'games' ? 'bg-gray-200' : ''
            }`}
          >
            <TextWithVoice>Games</TextWithVoice>
          </Button>
          <Button
            onClick={() => setActiveTab('history')}
            variant="ghost"
            size="sm"
            className={`text-gray-700 hover:bg-gray-200 ${
              activeTab === 'history' ? 'bg-gray-200' : ''
            }`}
          >
            <TextWithVoice>History</TextWithVoice>
          </Button>
        </div>

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <TextWithVoice>Game Progress (Level 1-10)</TextWithVoice>
            </h3>

            <div className="space-y-4">
              {Object.keys(gameInfo).map((gameId) => {
                const game = gameInfo[gameId];
                const currentLevel = getCurrentLevel(gameId);
                const stagesCompleted = getStagesCompleted(gameId);
                const accuracy = getAccuracyAtCurrentLevel(gameId);
                const stageProgress = (stagesCompleted / 50) * 100;

                return (
                  <div key={gameId} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Game Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{game.emoji}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-700">
                            <TextWithVoice>{game.name}</TextWithVoice>
                          </div>
                          <div className="text-xs text-gray-500">
                            <TextWithVoice>Level {currentLevel}</TextWithVoice>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">
                          <TextWithVoice>{accuracy}%</TextWithVoice>
                        </div>
                        <div className="text-xs text-gray-500">
                          <TextWithVoice>accuracy</TextWithVoice>
                        </div>
                      </div>
                    </div>

                    {/* Stage Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>
                          <TextWithVoice>Stages: {stagesCompleted}/50</TextWithVoice>
                        </span>
                        <span>
                          <TextWithVoice>{Math.round(stageProgress)}%</TextWithVoice>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`bg-${game.color}-600 h-2.5 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(stageProgress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Level Up Requirements */}
                    {stagesCompleted >= 50 && accuracy >= 77 ? (
                      <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <TextWithVoice>Ready to level up!</TextWithVoice>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        <TextWithVoice>
                          Need: {50 - stagesCompleted > 0 ? `${50 - stagesCompleted} stages` : ''}{' '}
                          {50 - stagesCompleted > 0 && accuracy < 77 ? '& ' : ''}
                          {accuracy < 77 ? `${Math.max(0, 77 - accuracy)}% accuracy` : ''}
                        </TextWithVoice>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <TextWithVoice>Daily History</TextWithVoice>
            </h3>

            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <TextWithVoice>Loading your progress...</TextWithVoice>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TextWithVoice>No data yet. Start playing to track your progress!</TextWithVoice>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score) => (
                  <div
                    key={score.date}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-gray-700">
                        <TextWithVoice>{formatDate(score.date)}</TextWithVoice>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <TextWithVoice>{formatTime(score.timeSpent)}</TextWithVoice>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Book className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-gray-500">
                            <TextWithVoice>Literacy</TextWithVoice>
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-blue-600">
                            <TextWithVoice>
                              {calculatePercentage(score.literacyCorrect, score.literacyTotal)}%
                            </TextWithVoice>
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            <TextWithVoice>
                              ({score.literacyCorrect}/{score.literacyTotal})
                            </TextWithVoice>
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Calculator className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-500">
                            <TextWithVoice>Numeracy</TextWithVoice>
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-green-600">
                            <TextWithVoice>
                              {calculatePercentage(score.numeracyCorrect, score.numeracyTotal)}%
                            </TextWithVoice>
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            <TextWithVoice>
                              ({score.numeracyCorrect}/{score.numeracyTotal})
                            </TextWithVoice>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}