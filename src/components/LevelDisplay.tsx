import { Star, Lock, TrendingUp, Award } from 'lucide-react';
import { TextWithVoice } from './TextWithVoice';

interface LevelDisplayProps {
  currentLevel: number;
  stagesCompleted: number;
  totalStages: number;
  accuracy: number;
  proficiencyThreshold: number;
}

export function LevelDisplay({
  currentLevel,
  stagesCompleted,
  totalStages,
  accuracy,
  proficiencyThreshold
}: LevelDisplayProps) {
  const progress = (stagesCompleted / totalStages) * 100;
  const isProficient = accuracy >= proficiencyThreshold;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-300 shadow-md">
      <div className="flex items-center justify-between mb-3">
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-600">
              <TextWithVoice>Current Level</TextWithVoice>
            </div>
            <div className="font-bold text-lg text-purple-700">
              <TextWithVoice>Level {currentLevel}</TextWithVoice>
            </div>
          </div>
        </div>

        {/* Accuracy Display */}
        <div className="text-right">
          <div className="text-xs text-gray-600">
            <TextWithVoice>Level Progress</TextWithVoice>
          </div>
          <div className={`font-bold text-lg ${isProficient ? 'text-green-600' : 'text-orange-600'}`}>
            <TextWithVoice>{accuracy}%</TextWithVoice>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <TextWithVoice>Stage Progress</TextWithVoice>
          <TextWithVoice>{stagesCompleted}/{totalStages}</TextWithVoice>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Message */}
      <div className="text-xs text-center mt-2">
        {stagesCompleted >= totalStages && isProficient ? (
          <div className="text-green-600 font-semibold flex items-center justify-center gap-1">
            <Award className="w-4 h-4" />
            <TextWithVoice>Ready to level up!</TextWithVoice>
          </div>
        ) : stagesCompleted >= totalStages && !isProficient ? (
          <div className="text-orange-600 font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <TextWithVoice>Complete more stages to reach {proficiencyThreshold}% proficiency</TextWithVoice>
          </div>
        ) : (
          <div className="text-gray-600">
            <TextWithVoice>
              {totalStages - stagesCompleted} stages remaining • Need {proficiencyThreshold}% to advance
            </TextWithVoice>
          </div>
        )}
      </div>
    </div>
  );
}

interface LevelSelectorProps {
  currentLevel: number;
  unlockedLevels: number[];
  onSelectLevel: (level: number) => void;
}

export function LevelSelector({ currentLevel, unlockedLevels, onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-center">
        <TextWithVoice>Select Your Level</TextWithVoice>
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
          const isUnlocked = unlockedLevels.includes(level);
          const isCurrent = level === currentLevel;

          return (
            <button
              key={level}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`
                relative rounded-lg p-3 transition-all
                ${isCurrent ? 'bg-purple-600 text-white ring-4 ring-purple-300' : ''}
                ${isUnlocked && !isCurrent ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : ''}
                ${!isUnlocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {!isUnlocked && (
                <Lock className="w-4 h-4 absolute top-1 right-1" />
              )}
              {isCurrent && (
                <Star className="w-4 h-4 absolute top-1 right-1" />
              )}
              <div className="font-bold text-lg">
                <TextWithVoice>{level}</TextWithVoice>
              </div>
              <div className="text-xs">
                <TextWithVoice>Level {level}</TextWithVoice>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}