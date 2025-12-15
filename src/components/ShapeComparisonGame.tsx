import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface ShapeProblem {
  shape1: { name: string, emoji: string, count: number };
  shape2: { name: string, emoji: string, count: number };
  question: string;
  correctAnswer: number;
}

const shapes = [
  { name: "circles", emoji: "🔵" },
  { name: "squares", emoji: "🟦" },
  { name: "triangles", emoji: "🔺" },
  { name: "stars", emoji: "⭐" },
  { name: "hearts", emoji: "❤️" },
  { name: "diamonds", emoji: "🔷" },
];

export function ShapeComparisonGame({ onBack }: { onBack: () => void }) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "shapecomparison";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentProblem, setCurrentProblem] = useState<ShapeProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateQuestion = () => {
    // Difficulty scales with level
    const maxCount = Math.min(5 + currentLevel, 20);
    const minCount = Math.max(1, currentLevel - 2);

    const shape1 = shapes[Math.floor(Math.random() * shapes.length)];
    let shape2 = shapes[Math.floor(Math.random() * shapes.length)];
    while (shape2.name === shape1.name) {
      shape2 = shapes[Math.floor(Math.random() * shapes.length)];
    }

    const count1 = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const count2 = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    // Ensure they're not equal for "how many more" questions
    if (count1 === count2) {
      return generateQuestion();
    }

    const difference = Math.abs(count1 - count2);
    const moreShape = count1 > count2 ? shape1.name : shape2.name;

    setCurrentProblem({
      shape1: { ...shape1, count: count1 },
      shape2: { ...shape2, count: count2 },
      question: `How many more ${moreShape} are there?`,
      correctAnswer: difference,
    });
    setUserAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const checkAnswer = () => {
    if (!currentProblem || userAnswer === "") return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.correctAnswer;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'numeracy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'numeracy');
      speak(`The answer is ${currentProblem.correctAnswer}`);
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

  if (!currentProblem) {
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
            <TextWithVoice>🔺 Shape Sorting in the Saguenay - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Shape Display */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-cyan-50 rounded-2xl">
            <p className="text-lg mb-4 font-semibold text-cyan-800">
              <TextWithVoice>{currentProblem.shape1.name}</TextWithVoice>
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[...Array(currentProblem.shape1.count)].map((_, i) => (
                <span key={i} className="text-4xl">{currentProblem.shape1.emoji}</span>
              ))}
            </div>
            <p className="text-2xl font-bold mt-4 text-cyan-800">
              <TextWithVoice>{currentProblem.shape1.count}</TextWithVoice>
            </p>
          </div>

          <div className="text-center p-6 bg-teal-50 rounded-2xl">
            <p className="text-lg mb-4 font-semibold text-teal-800">
              <TextWithVoice>{currentProblem.shape2.name}</TextWithVoice>
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[...Array(currentProblem.shape2.count)].map((_, i) => (
                <span key={i} className="text-4xl">{currentProblem.shape2.emoji}</span>
              ))}
            </div>
            <p className="text-2xl font-bold mt-4 text-teal-800">
              <TextWithVoice>{currentProblem.shape2.count}</TextWithVoice>
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-gray-800">
            <TextWithVoice>{currentProblem.question}</TextWithVoice>
          </p>
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && userAnswer && feedback === null && checkAnswer()}
            placeholder="Enter your answer..."
            className="w-full max-w-md mx-auto block p-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
            autoFocus
            disabled={feedback !== null}
          />
        </div>

        <Button
          onClick={checkAnswer}
          disabled={!userAnswer || feedback !== null}
          className="w-full"
          size="lg"
        >
          <TextWithVoice>Check Answer</TextWithVoice>
        </Button>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mt-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mt-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Incorrect. The answer is {currentProblem.correctAnswer}</TextWithVoice>
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
                  i < questionsInStage ? 'bg-cyan-600' : 'bg-gray-200'
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