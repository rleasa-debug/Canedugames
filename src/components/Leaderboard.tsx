import { Trophy, Medal, Award, Crown, TrendingUp, Flame, Gamepad2, Target, X, BookOpen, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { TextWithVoice } from './TextWithVoice';
import { useScore } from '../contexts/ScoreContext';
import { useState, useEffect } from 'react';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  literacyCorrect: number;
  literacyTotal: number;
  numeracyCorrect: number;
  numeracyTotal: number;
  weeklyScore: number;
  rank: number;
}

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [weekStart, setWeekStart] = useState<string>('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }

        // Fetch weekly leaderboard from server
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/leaderboard/weekly`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data.leaderboard || []);
          setWeekStart(data.weekStart || '');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(/[\s._-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isCurrentUser = (entry: LeaderboardEntry) => {
    return entry.userId === currentUserId;
  };

  const formatWeekDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg px-6 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Trophy className="w-10 h-10" />
            <div>
              <h2 className="text-3xl">
                <TextWithVoice>Weekly Leaderboard</TextWithVoice>
              </h2>
              <p className="text-sm text-purple-100">
                <TextWithVoice>Top 10 Students - Week of {formatWeekDate(weekStart)}</TextWithVoice>
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">
                <TextWithVoice>Loading leaderboard...</TextWithVoice>
              </p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                <TextWithVoice>No data available yet. Start playing to see the leaderboard!</TextWithVoice>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((entry) => {
                const literacyPercent = entry.literacyTotal > 0 
                  ? Math.round((entry.literacyCorrect / entry.literacyTotal) * 100) 
                  : 0;
                const numeracyPercent = entry.numeracyTotal > 0 
                  ? Math.round((entry.numeracyCorrect / entry.numeracyTotal) * 100) 
                  : 0;

                return (
                  <div
                    key={entry.userId}
                    className={`relative rounded-lg border-2 ${
                      isCurrentUser(entry) 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 bg-white'
                    } transition-all hover:shadow-md`}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white shadow-lg font-bold`}>
                      <span className="text-lg">#{entry.rank}</span>
                    </div>

                    <div className="p-4 pl-14">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Avatar */}
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                            {getInitials(entry.name)}
                          </div>
                          
                          {/* Name and Stats */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-semibold truncate">
                                <TextWithVoice>{entry.name}</TextWithVoice>
                              </h3>
                              {getRankIcon(entry.rank)}
                              {isCurrentUser(entry) && (
                                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-lg font-bold text-purple-600">
                              {entry.weeklyScore}
                              <span className="text-sm text-gray-500 ml-1">points</span>
                            </div>
                          </div>
                        </div>

                        {/* Score Progress */}
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-gray-500 mb-1">Weekly Score</div>
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)}`}
                              style={{ width: `${Math.min(100, (entry.weeklyScore / 100) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject Scores */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 rounded-lg p-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-blue-600 font-medium">Literacy</div>
                            <div className="text-blue-700 font-bold">
                              {entry.literacyCorrect}/{entry.literacyTotal} 
                              <span className="ml-1">({literacyPercent}%)</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-red-600 font-medium">Numeracy</div>
                            <div className="text-red-700 font-bold">
                              {entry.numeracyCorrect}/{entry.numeracyTotal}
                              <span className="ml-1">({numeracyPercent}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg text-center text-xs text-gray-500">
          <p>
            <TextWithVoice>Leaderboard resets every Monday at midnight. Keep learning to climb the ranks! 🚀</TextWithVoice>
          </p>
        </div>
      </div>
    </div>
  );
}
