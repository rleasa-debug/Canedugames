import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";
import multiplicationChart from "figma:asset/9f1cf16d53f14febe9a6de0bad37d154fbba2c59.png";

interface TimesTablesPracticeProps {
  onBack: () => void;
}

export function TimesTablesPractice({ onBack }: TimesTablesPracticeProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "timestables";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 10;

  // Determine multiplication range based on level
  const getMultiplicationRange = (level: number): { tables: number[], maxMultiplier: number } => {
    switch (level) {
      case 1: return { tables: [1, 2], maxMultiplier: 5 }; // 1s and 2s up to 5
      case 2: return { tables: [1, 2, 3], maxMultiplier: 10 }; // 1s, 2s, 3s up to 10
      case 3: return { tables: [2, 3, 4, 5], maxMultiplier: 10 }; // 2-5 tables
      case 4: return { tables: [3, 4, 5, 6], maxMultiplier: 10 }; // 3-6 tables
      case 5: return { tables: [5, 6, 7, 8], maxMultiplier: 10 }; // 5-8 tables
      case 6: return { tables: [6, 7, 8, 9], maxMultiplier: 12 }; // 6-9 tables
      case 7: return { tables: [7, 8, 9, 10], maxMultiplier: 12 }; // 7-10 tables
      case 8: return { tables: [8, 9, 10, 11, 12], maxMultiplier: 12 }; // 8-12 tables
      case 9: return { tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], maxMultiplier: 15 }; // All tables up to 15
      case 10: return { tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], maxMultiplier: 20 }; // All tables up to 20
      default: return { tables: [1, 2], maxMultiplier: 5 };
    }
  };

  const generateQuestion = () => {
    const { tables, maxMultiplier } = getMultiplicationRange(currentLevel);
    
    const n1 = tables[Math.floor(Math.random() * tables.length)];
    const n2 = Math.floor(Math.random() * maxMultiplier) + 1;
    
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    const correctAnswer = num1 * num2;
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'numeracy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'numeracy');
      speak(`Incorrect. ${num1} times ${num2} is ${correctAnswer}`);
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

  const { tables, maxMultiplier } = getMultiplicationRange(currentLevel);

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
            <TextWithVoice>⏰ Times Tables in Toronto - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Toggle Chart Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-2"
          >
            {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <TextWithVoice>{showChart ? "Hide" : "Show"} Multiplication Chart</TextWithVoice>
          </Button>
        </div>

        {/* Multiplication Chart */}
        {showChart && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <ImageWithFallback
              src={multiplicationChart}
              alt="Multiplication Chart"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-6 font-bold">
            <TextWithVoice>{num1} × {num2} = ?</TextWithVoice>
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && answer && feedback === null && checkAnswer()}
            placeholder="Your answer..."
            className="w-full max-w-md p-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-6"
            autoFocus
            disabled={feedback !== null}
          />

          {feedback === "correct" && (
            <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2">
              <Check className="w-6 h-6" />
              <TextWithVoice>Correct! {num1} × {num2} = {num1 * num2}</TextWithVoice>
            </div>
          )}

          {feedback === "incorrect" && (
            <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
              <X className="w-6 h-6" />
              <TextWithVoice>Incorrect. {num1} × {num2} = {num1 * num2}</TextWithVoice>
            </div>
          )}
        </div>

        <Button
          onClick={checkAnswer}
          disabled={!answer || feedback !== null}
          className="w-full"
          size="lg"
        >
          <TextWithVoice>Check Answer</TextWithVoice>
        </Button>

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
                  i < questionsInStage ? 'bg-orange-600' : 'bg-gray-200'
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