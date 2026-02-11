import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface ActivityLog {
  id: string;
  gameName: string;
  gameId: string;
  date: string;
  accuracy: number;
  correct: number;
  total: number;
  type: 'literacy' | 'numeracy';
  duration: number; // seconds spent on activity
}

interface Stats {
  literacy: { correct: number; attempted: number };
  numeracy: { correct: number; attempted: number };
  stagesCompleted: number;
}

interface ScoreContextType {
  totalScore: number;
  literacyCorrect: number;
  literacyTotal: number;
  numeracyCorrect: number;
  numeracyTotal: number;
  timeSpent: number;
  sessionTime: number; // Current session timer
  activityLog: ActivityLog[];
  currentLevel: number;
  stats: Stats;
  addPoints: (points: number) => void;
  recordAnswer: (type: 'literacy' | 'numeracy', isCorrect: boolean) => void;
  resetScore: () => void;
  syncScores: () => Promise<void>;
  logActivity: (gameName: string, gameId: string, correct: number, total: number, type: 'literacy' | 'numeracy', duration: number) => void;
  literacyScore: { correct: number; total: number };
  numeracyScore: { correct: number; total: number };
  setAccessToken: (token: string | null) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState<number>(0);
  
  const [totalScore, setTotalScore] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [literacyCorrect, setLiteracyCorrect] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_literacy_correct');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [literacyTotal, setLiteracyTotal] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_literacy_total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [numeracyCorrect, setNumeracyCorrect] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_numeracy_correct');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [numeracyTotal, setNumeracyTotal] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_numeracy_total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [timeSpent, setTimeSpent] = useState<number>(() => {
    const saved = localStorage.getItem('ontedgames_time_spent');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [activityLog, setActivityLog] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ontedgames_activity_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Derived stats
  const stagesCompleted = literacyTotal + numeracyTotal;
  const stats: Stats = {
    literacy: { correct: literacyCorrect, attempted: literacyTotal },
    numeracy: { correct: numeracyCorrect, attempted: numeracyTotal },
    stagesCompleted
  };

  // Timer to track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        localStorage.setItem('ontedgames_time_spent', newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Timer to track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset scores when tab becomes hidden (user leaves)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔄 Tab hidden - resetting scores');
        // We typically don't reset persistent progress on tab hide, 
        // but keeping original logic if intended for session security or similar.
        // However, level and total progress usually shouldn't reset.
        // The original code called resetScore(), which wipes everything.
        // For a game with levels, we might want to PERSIST levels.
        // Commenting out full reset to preserve level progress as requested by user intent "advance levels".
        // resetScore(); 
        setSessionTime(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Persist scores to localStorage
  useEffect(() => {
    localStorage.setItem('ontedgames_score', totalScore.toString());
  }, [totalScore]);

  useEffect(() => {
    localStorage.setItem('ontedgames_literacy_correct', literacyCorrect.toString());
  }, [literacyCorrect]);

  useEffect(() => {
    localStorage.setItem('ontedgames_literacy_total', literacyTotal.toString());
  }, [literacyTotal]);

  useEffect(() => {
    localStorage.setItem('ontedgames_numeracy_correct', numeracyCorrect.toString());
  }, [numeracyCorrect]);

  useEffect(() => {
    localStorage.setItem('ontedgames_numeracy_total', numeracyTotal.toString());
  }, [numeracyTotal]);

  useEffect(() => {
    localStorage.setItem('ontedgames_level', currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('ontedgames_activity_log', JSON.stringify(activityLog));
  }, [activityLog]);

  const addPoints = (points: number) => {
    setTotalScore(prev => prev + points);
  };

  const recordAnswer = (type: 'literacy' | 'numeracy', isCorrect: boolean) => {
    let newLiteracyCorrect = literacyCorrect;
    let newLiteracyTotal = literacyTotal;
    let newNumeracyCorrect = numeracyCorrect;
    let newNumeracyTotal = numeracyTotal;

    if (type === 'literacy') {
      newLiteracyTotal = literacyTotal + 1;
      setLiteracyTotal(newLiteracyTotal);
      if (isCorrect) {
        newLiteracyCorrect = literacyCorrect + 1;
        setLiteracyCorrect(newLiteracyCorrect);
        addPoints(10);
      }
    } else {
      newNumeracyTotal = numeracyTotal + 1;
      setNumeracyTotal(newNumeracyTotal);
      if (isCorrect) {
        newNumeracyCorrect = numeracyCorrect + 1;
        setNumeracyCorrect(newNumeracyCorrect);
        addPoints(10);
      }
    }

    // Level Up Logic
    // "users must complete 50 stages with 77% proficiency to advance levels"
    // Interpreting "stage" as an answer/question for granular tracking
    const totalAnswers = newLiteracyTotal + newNumeracyTotal;
    
    // Check if we hit a 50-stage milestone
    if (totalAnswers > 0 && totalAnswers % 50 === 0) {
      const totalCorrect = newLiteracyCorrect + newNumeracyCorrect;
      const proficiency = (totalCorrect / totalAnswers) * 100;

      if (proficiency >= 77 && currentLevel < 10) {
        setCurrentLevel(prev => prev + 1);
        // Optionally show celebration here or rely on UI to react to level change
      }
    }
  };

  const resetScore = () => {
    setTotalScore(0);
    setLiteracyCorrect(0);
    setLiteracyTotal(0);
    setNumeracyCorrect(0);
    setNumeracyTotal(0);
    setCurrentLevel(1);
    setTimeSpent(0);
    setActivityLog([]);
    localStorage.removeItem('ontedgames_score');
    localStorage.removeItem('ontedgames_literacy_correct');
    localStorage.removeItem('ontedgames_literacy_total');
    localStorage.removeItem('ontedgames_numeracy_correct');
    localStorage.removeItem('ontedgames_numeracy_total');
    localStorage.removeItem('ontedgames_level');
    localStorage.removeItem('ontedgames_time_spent');
    localStorage.removeItem('ontedgames_activity_log');
  };

  const syncScores = async () => {
    // Get fresh session token from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      // Silently skip sync if not logged in or session error (not an error)
      return;
    }

    const currentToken = session.access_token;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/scores/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            totalScore,
            literacyCorrect,
            literacyTotal,
            numeracyCorrect,
            numeracyTotal,
            currentLevel,
            timeSpent,
            activityLog,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to sync scores:', errorData);
      }
    } catch (error) {
      console.error('Error syncing scores:', error);
    }
  };

  // Auto-sync scores every 30 seconds if logged in
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // Initial sync after 2 seconds (give time for everything to load)
    const initialTimeout = setTimeout(() => {
      syncScores();
    }, 2000);

    // Then sync every 30 seconds
    const interval = setInterval(() => {
      syncScores();
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [accessToken]);

  const logActivity = async (gameName: string, gameId: string, correct: number, total: number, type: 'literacy' | 'numeracy', duration: number) => {
    const activityId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const activity: ActivityLog = {
      id: activityId,
      gameName,
      gameId,
      date: new Date().toISOString(),
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      correct,
      total,
      type,
      duration,
    };

    setActivityLog(prev => [...prev, activity]);

    // Sync activity to backend if logged in
    const { data: { session } } = await supabase.auth.getSession();
    const currentToken = session?.access_token;
    
    if (currentToken) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/activity/log`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`,
            },
            body: JSON.stringify({
              activityId,
              gameName,
              gameId,
              correct,
              total,
              type,
              duration,
            }),
          }
        );
      } catch (error) {
        console.error('Error logging activity to backend:', error);
      }
    }
  };

  return (
    <ScoreContext.Provider value={{ 
      totalScore, 
      literacyCorrect, 
      literacyTotal, 
      numeracyCorrect, 
      numeracyTotal, 
      timeSpent,
      sessionTime,
      activityLog,
      currentLevel,
      stats,
      addPoints, 
      recordAnswer, 
      resetScore,
      syncScores,
      logActivity,
      literacyScore: { correct: literacyCorrect, total: literacyTotal },
      numeracyScore: { correct: numeracyCorrect, total: numeracyTotal },
      setAccessToken,
    }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}
