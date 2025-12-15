import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { TextWithVoice } from "./TextWithVoice";
import { speak } from "../utils/voice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface RhymePair {
  word1: string;
  word2: string;
  emoji1: string;
  emoji2: string;
  rhymes: boolean;
}

// Rhyming pairs organized by difficulty level
const rhymesByLevel: Record<number, RhymePair[]> = {
  1: [ // Simple CVC rhymes
    { word1: "cat", word2: "hat", emoji1: "🐱", emoji2: "🎩", rhymes: true },
    { word1: "dog", word2: "log", emoji1: "🐕", emoji2: "🪵", rhymes: true },
    { word1: "sun", word2: "run", emoji1: "☀️", emoji2: "🏃", rhymes: true },
    { word1: "bed", word2: "red", emoji1: "🛏️", emoji2: "🔴", rhymes: true },
    { word1: "box", word2: "fox", emoji1: "📦", emoji2: "🦊", rhymes: true },
  ],
  2: [ // Mix of rhymes and non-rhymes
    { word1: "fan", word2: "pan", emoji1: "🪭", emoji2: "🍳", rhymes: true },
    { word1: "flag", word2: "bag", emoji1: "🏴", emoji2: "🎒", rhymes: true },
    { word1: "lamp", word2: "nest", emoji1: "💡", emoji2: "🪺", rhymes: false },
    { word1: "pot", word2: "hat", emoji1: "🫖", emoji2: "🎩", rhymes: false },
  ],
  3: [ // Longer words
    { word1: "five", word2: "hive", emoji1: "5️⃣", emoji2: "🐝", rhymes: true },
    { word1: "star", word2: "car", emoji1: "⭐", emoji2: "🚗", rhymes: true },
    { word1: "tree", word2: "bee", emoji1: "🌳", emoji2: "🐝", rhymes: true },
    { word1: "boat", word2: "coat", emoji1: "⛵", emoji2: "🧥", rhymes: true },
  ],
  4: [
    { word1: "train", word2: "rain", emoji1: "🚂", emoji2: "🌧️", rhymes: true },
    { word1: "snake", word2: "cake", emoji1: "🐍", emoji2: "🍰", rhymes: true },
    { word1: "light", word2: "night", emoji1: "💡", emoji2: "🌙", rhymes: true },
    { word1: "chair", word2: "bear", emoji1: "🪑", emoji2: "🐻", rhymes: true },
  ],
  5: [
    { word1: "flower", word2: "power", emoji1: "🌸", emoji2: "⚡", rhymes: true },
    { word1: "winter", word2: "splinter", emoji1: "❄️", emoji2: "🪵", rhymes: true },
    { word1: "money", word2: "honey", emoji1: "💰", emoji2: "🍯", rhymes: true },
    { word1: "station", word2: "nation", emoji1: "🚉", emoji2: "🏳️", rhymes: true },
  ],
  6: [
    { word1: "treasure", word2: "measure", emoji1: "💎", emoji2: "📏", rhymes: true },
    { word1: "pleasure", word2: "leisure", emoji1: "😊", emoji2: "🏖️", rhymes: true },
    { word1: "mountain", word2: "fountain", emoji1: "⛰️", emoji2: "⛲", rhymes: true },
    { word1: "daughter", word2: "water", emoji1: "👧", emoji2: "💧", rhymes: true },
  ],
  7: [
    { word1: "education", word2: "station", emoji1: "🎓", emoji2: "🚉", rhymes: true },
    { word1: "celebration", word2: "creation", emoji1: "🎉", emoji2: "🎨", rhymes: true },
    { word1: "population", word2: "foundation", emoji1: "👥", emoji2: "🏛️", rhymes: true },
    { word1: "vacation", word2: "location", emoji1: "🏖️", emoji2: "📍", rhymes: true },
  ],
  8: [
    { word1: "mysterious", word2: "serious", emoji1: "🔍", emoji2: "😐", rhymes: true },
    { word1: "hilarious", word2: "various", emoji1: "😂", emoji2: "🎭", rhymes: true },
    { word1: "courageous", word2: "outrageous", emoji1: "🦁", emoji2: "😱", rhymes: true },
    { word1: "delicious", word2: "suspicious", emoji1: "😋", emoji2: "🤨", rhymes: true },
  ],
  9: [
    { word1: "philosophy", word2: "geography", emoji1: "🤔", emoji2: "🌍", rhymes: true },
    { word1: "democracy", word2: "bureaucracy", emoji1: "🗳️", emoji2: "🏛️", rhymes: true },
    { word1: "reality", word2: "quality", emoji1: "✨", emoji2: "⭐", rhymes: true },
    { word1: "community", word2: "opportunity", emoji1: "👥", emoji2: "🚪", rhymes: true },
  ],
  10: [
    { word1: "extraordinary", word2: "contemporary", emoji1: "🌟", emoji2: "📅", rhymes: true },
    { word1: "revolutionary", word2: "evolutionary", emoji1: "🔄", emoji2: "🦕", rhymes: true },
    { word1: "parliamentary", word2: "complementary", emoji1: "🏛️", emoji2: "🤝", rhymes: true },
    { word1: "preliminary", word2: "subsidiary", emoji1: "📋", emoji2: "🏢", rhymes: true },
  ],
};

export function RhymingGame({ onBack }: { onBack: () => void }) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "rhyming";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentPair, setCurrentPair] = useState<RhymePair | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateQuestion = () => {
    const levelPairs = rhymesByLevel[currentLevel] || rhymesByLevel[1];
    const randomPair = levelPairs[Math.floor(Math.random() * levelPairs.length)];
    
    setCurrentPair(randomPair);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const handleAnswer = (answer: boolean) => {
    if (feedback !== null || !currentPair) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentPair.rhymes;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(currentPair.rhymes ? "They do rhyme!" : "They don't rhyme!");
    }

    setStageTotal(stageTotal + 1);
    setQuestionsInStage(questionsInStage + 1);

    setTimeout(() => {
      if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
        completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
      } else {
        generateQuestion();
      }
    }, 1500);
  };

  const completeStage = async (correct: number, total: number) => {
    await recordStageCompletion(gameId, correct, total);
    
    setStageCorrect(0);
    setStageTotal(0);
    setQuestionsInStage(0);

    if (canLevelUp(gameId)) {
      setShowLevelUp(true);
    } else {
      generateQuestion();
    }
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    generateQuestion();
  };

  if (!currentPair) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>

      <div className="mb-6">
        <LevelDisplay
          currentLevel={currentLevel}
          stagesCompleted={stagesCompleted}
          totalStages={50}
          accuracy={accuracy}
          proficiencyThreshold={77}
        />
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">
            <TextWithVoice>🎵 Rhyming on the Rivers - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Word Pair Display */}
        <div className="mb-8">
          <p className="text-center text-xl text-gray-700 mb-6">
            <TextWithVoice>Do these words rhyme?</TextWithVoice>
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center p-6 bg-indigo-50 rounded-2xl">
              <div className="text-7xl mb-4">{currentPair.emoji1}</div>
              <div className="text-3xl font-bold text-indigo-600">
                <TextWithVoice>{currentPair.word1}</TextWithVoice>
              </div>
              <Button
                onClick={() => speak(currentPair.word1)}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-7xl mb-4">{currentPair.emoji2}</div>
              <div className="text-3xl font-bold text-purple-600">
                <TextWithVoice>{currentPair.word2}</TextWithVoice>
              </div>
              <Button
                onClick={() => speak(currentPair.word2)}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => handleAnswer(true)}
            disabled={feedback !== null}
            variant={selectedAnswer === true ? (feedback === "correct" ? "default" : "destructive") : "outline"}
            className={`p-8 text-2xl h-auto ${
              selectedAnswer === true && feedback === "correct"
                ? "bg-green-500 hover:bg-green-600"
                : selectedAnswer === true && feedback === "incorrect"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }`}
            size="lg"
          >
            <CheckCircle2 className="w-8 h-8 mr-3" />
            <TextWithVoice>Yes, they rhyme!</TextWithVoice>
          </Button>

          <Button
            onClick={() => handleAnswer(false)}
            disabled={feedback !== null}
            variant={selectedAnswer === false ? (feedback === "correct" ? "default" : "destructive") : "outline"}
            className={`p-8 text-2xl h-auto ${
              selectedAnswer === false && feedback === "correct"
                ? "bg-green-500 hover:bg-green-600"
                : selectedAnswer === false && feedback === "incorrect"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }`}
            size="lg"
          >
            <XCircle className="w-8 h-8 mr-3" />
            <TextWithVoice>No, they don't rhyme</TextWithVoice>
          </Button>
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl text-center mb-4">
            <TextWithVoice>
              Correct! {currentPair.word1} and {currentPair.word2} {currentPair.rhymes ? "rhyme" : "don't rhyme"}!
            </TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl text-center mb-4">
            <TextWithVoice>
              {currentPair.rhymes 
                ? `Actually, ${currentPair.word1} and ${currentPair.word2} do rhyme!`
                : `Actually, ${currentPair.word1} and ${currentPair.word2} don't rhyme!`
              }
            </TextWithVoice>
          </div>
        )}

        {/* Stage Progress */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Stage Progress</TextWithVoice>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(QUESTIONS_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-full ${
                  i < questionsInStage ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {showLevelUp && (
        <LevelUpModal
          newLevel={currentLevel + 1}
          onContinue={handleLevelUpContinue}
          onClose={() => {
            setShowLevelUp(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}