import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as kv from '../supabase/functions/server/kv_store';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface GameProgress {
  level: number; // 1-10 (corresponding to Level 1-10)
  stagesCompleted: number; // 0-50
  correct: number; // Correct answers at this level
  total: number; // Total attempts at this level
  unlockedLevels: number[]; // Array of unlocked level numbers
}

interface ProgressionContextType {
  getGameProgress: (gameId: string) => GameProgress;
  recordStageCompletion: (gameId: string, correct: number, total: number) => Promise<void>;
  canLevelUp: (gameId: string) => boolean;
  levelUp: (gameId: string) => Promise<void>;
  getCurrentLevel: (gameId: string) => number;
  getStagesCompleted: (gameId: string) => number;
  getAccuracyAtCurrentLevel: (gameId: string) => number;
  isLevelUnlocked: (gameId: string, level: number) => boolean;
  resetGameProgress: (gameId: string) => Promise<void>;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

const PROFICIENCY_THRESHOLD = 77; // 77% accuracy required
const STAGES_PER_LEVEL = 50;

const DEFAULT_PROGRESS: GameProgress = {
  level: 1,
  stagesCompleted: 0,
  correct: 0,
  total: 0,
  unlockedLevels: [1] // Level 1 is always unlocked
};

export function ProgressionProvider({ 
  children, 
  accessToken 
}: { 
  children: ReactNode; 
  accessToken?: string;
}) {
  const [progressCache, setProgressCache] = useState<Record<string, GameProgress>>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from access token
  useEffect(() => {
    if (!accessToken) return;

    fetch(`https://${projectId}.supabase.co/auth/v1/user`, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'apikey': publicAnonKey
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUserId(data.id);
        }
      })
      .catch(err => console.error('Error fetching user:', err));
  }, [accessToken]);

  // Load progress from server
  const loadProgress = async (gameId: string): Promise<GameProgress> => {
    if (!userId || !accessToken) return DEFAULT_PROGRESS;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/progression/${userId}/${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data || DEFAULT_PROGRESS;
      }
    } catch (error) {
      console.error('Error loading progression:', error);
    }

    return DEFAULT_PROGRESS;
  };

  // Save progress to server
  const saveProgress = async (gameId: string, progress: GameProgress): Promise<void> => {
    if (!userId || !accessToken) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/progression/${userId}/${gameId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(progress)
        }
      );
    } catch (error) {
      console.error('Error saving progression:', error);
    }
  };

  // Get game progress (from cache or load)
  const getGameProgress = (gameId: string): GameProgress => {
    if (progressCache[gameId]) {
      return progressCache[gameId];
    }
    
    // Load asynchronously and update cache
    loadProgress(gameId).then(progress => {
      setProgressCache(prev => ({ ...prev, [gameId]: progress }));
    });

    return DEFAULT_PROGRESS;
  };

  // Record stage completion
  const recordStageCompletion = async (gameId: string, correct: number, total: number): Promise<void> => {
    const currentProgress = await loadProgress(gameId);
    
    const updatedProgress: GameProgress = {
      ...currentProgress,
      stagesCompleted: currentProgress.stagesCompleted + 1,
      correct: currentProgress.correct + correct,
      total: currentProgress.total + total
    };

    // Update cache
    setProgressCache(prev => ({ ...prev, [gameId]: updatedProgress }));
    
    // Save to server
    await saveProgress(gameId, updatedProgress);
  };

  // Check if can level up (completed 50 stages AND 77%+ accuracy)
  const canLevelUp = (gameId: string): boolean => {
    const progress = progressCache[gameId] || DEFAULT_PROGRESS;
    
    if (progress.level >= 10) return false; // Max level reached
    if (progress.stagesCompleted < STAGES_PER_LEVEL) return false;
    
    const accuracy = progress.total > 0 ? (progress.correct / progress.total) * 100 : 0;
    return accuracy >= PROFICIENCY_THRESHOLD;
  };

  // Level up
  const levelUp = async (gameId: string): Promise<void> => {
    const currentProgress = await loadProgress(gameId);
    
    if (!canLevelUp(gameId)) return;
    
    const newLevel = currentProgress.level + 1;
    const updatedProgress: GameProgress = {
      level: newLevel,
      stagesCompleted: 0,
      correct: 0,
      total: 0,
      unlockedLevels: [...currentProgress.unlockedLevels, newLevel]
    };

    // Update cache
    setProgressCache(prev => ({ ...prev, [gameId]: updatedProgress }));
    
    // Save to server
    await saveProgress(gameId, updatedProgress);
  };

  // Get current level
  const getCurrentLevel = (gameId: string): number => {
    const progress = progressCache[gameId] || DEFAULT_PROGRESS;
    return progress.level;
  };

  // Get stages completed
  const getStagesCompleted = (gameId: string): number => {
    const progress = progressCache[gameId] || DEFAULT_PROGRESS;
    return progress.stagesCompleted;
  };

  // Get accuracy at current level
  const getAccuracyAtCurrentLevel = (gameId: string): number => {
    const progress = progressCache[gameId] || DEFAULT_PROGRESS;
    return progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;
  };

  // Check if level is unlocked
  const isLevelUnlocked = (gameId: string, level: number): boolean => {
    const progress = progressCache[gameId] || DEFAULT_PROGRESS;
    return progress.unlockedLevels.includes(level);
  };

  // Reset game progress
  const resetGameProgress = async (gameId: string): Promise<void> => {
    const resetProgress: GameProgress = { ...DEFAULT_PROGRESS };
    
    // Update cache
    setProgressCache(prev => ({ ...prev, [gameId]: resetProgress }));
    
    // Save to server
    await saveProgress(gameId, resetProgress);
  };

  return (
    <ProgressionContext.Provider
      value={{
        getGameProgress,
        recordStageCompletion,
        canLevelUp,
        levelUp,
        getCurrentLevel,
        getStagesCompleted,
        getAccuracyAtCurrentLevel,
        isLevelUnlocked,
        resetGameProgress
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
}

export function useProgression() {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within ProgressionProvider');
  }
  return context;
}