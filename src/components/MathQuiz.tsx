import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, ArrowRight } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface MathQuizProps {
  onBack: () => void;
}

type Operation = "+" | "-" | "×" | "÷";

interface Question {
  num1: number;
  num2: number;
  operator: Operation;
  answer: number;
}

export function MathQuiz({ onBack }: MathQuizProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "math";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 10; // 10 questions = 1 stage

  // Generate question based on current level
  const generateQuestion = (): Question => {
    let n1: number, n2: number, ans: number, op: Operation;

    switch (currentLevel) {
      case 1: // Level 1: Simple addition 1-10
        op = "+";
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        ans = n1 + n2;
        break;

      case 2: // Level 2: Addition/subtraction up to 20
        op = Math.random() > 0.5 ? "+" : "-";
        if (op === "+") {
          n1 = Math.floor(Math.random() * 15) + 1;
          n2 = Math.floor(Math.random() * (20 - n1)) + 1;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 20) + 5;
          n2 = Math.floor(Math.random() * n1) + 1;
          ans = n1 - n2;
        }
        break;

      case 3: // Level 3: Multiplication tables 1-5, operations up to 50
        const ops3: Operation[] = ["+", "-", "×"];
        op = ops3[Math.floor(Math.random() * ops3.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 5) + 1;
          n2 = Math.floor(Math.random() * 5) + 1;
          ans = n1 * n2;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 40) + 1;
          n2 = Math.floor(Math.random() * (50 - n1)) + 1;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 50) + 10;
          n2 = Math.floor(Math.random() * n1) + 1;
          ans = n1 - n2;
        }
        break;

      case 4: // Level 4: All operations up to 100
        const ops4: Operation[] = ["+", "-", "×", "÷"];
        op = ops4[Math.floor(Math.random() * ops4.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 10) + 1;
          n2 = Math.floor(Math.random() * 10) + 1;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 10) + 1;
          ans = Math.floor(Math.random() * 10) + 1;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 80) + 1;
          n2 = Math.floor(Math.random() * (100 - n1)) + 1;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 100) + 20;
          n2 = Math.floor(Math.random() * n1) + 1;
          ans = n1 - n2;
        }
        break;

      case 5: // Level 5: Larger multiplication/division
        op = Math.random() > 0.5 ? "×" : "÷";
        if (op === "×") {
          n1 = Math.floor(Math.random() * 12) + 1;
          n2 = Math.floor(Math.random() * 12) + 1;
          ans = n1 * n2;
        } else {
          n2 = Math.floor(Math.random() * 12) + 1;
          ans = Math.floor(Math.random() * 12) + 1;
          n1 = n2 * ans;
        }
        break;

      case 6: // Level 6: All operations with larger numbers
        const ops6: Operation[] = ["+", "-", "×", "÷"];
        op = ops6[Math.floor(Math.random() * ops6.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 15) + 5;
          n2 = Math.floor(Math.random() * 15) + 5;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 15) + 5;
          ans = Math.floor(Math.random() * 15) + 5;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 200) + 50;
          n2 = Math.floor(Math.random() * 200) + 50;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 300) + 100;
          n2 = Math.floor(Math.random() * 200) + 50;
          ans = n1 - n2;
        }
        break;

      case 7: // Level 7: More complex operations
        const ops7: Operation[] = ["+", "-", "×", "÷"];
        op = ops7[Math.floor(Math.random() * ops7.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 20) + 10;
          n2 = Math.floor(Math.random() * 20) + 10;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 20) + 10;
          ans = Math.floor(Math.random() * 20) + 10;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 500) + 100;
          n2 = Math.floor(Math.random() * 500) + 100;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 800) + 200;
          n2 = Math.floor(Math.random() * 400) + 100;
          ans = n1 - n2;
        }
        break;

      case 8: // Level 8: Advanced operations
        const ops8: Operation[] = ["+", "-", "×", "÷"];
        op = ops8[Math.floor(Math.random() * ops8.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 30) + 15;
          n2 = Math.floor(Math.random() * 30) + 15;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 25) + 15;
          ans = Math.floor(Math.random() * 25) + 15;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 1000) + 200;
          n2 = Math.floor(Math.random() * 1000) + 200;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 1500) + 500;
          n2 = Math.floor(Math.random() * 800) + 200;
          ans = n1 - n2;
        }
        break;

      case 9: // Level 9: Complex calculations
        const ops9: Operation[] = ["+", "-", "×", "÷"];
        op = ops9[Math.floor(Math.random() * ops9.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 50) + 20;
          n2 = Math.floor(Math.random() * 50) + 20;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 40) + 20;
          ans = Math.floor(Math.random() * 40) + 20;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 2000) + 500;
          n2 = Math.floor(Math.random() * 2000) + 500;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 3000) + 1000;
          n2 = Math.floor(Math.random() * 1500) + 500;
          ans = n1 - n2;
        }
        break;

      case 10: // Level 10: Most challenging
        const ops10: Operation[] = ["+", "-", "×", "÷"];
        op = ops10[Math.floor(Math.random() * ops10.length)];
        if (op === "×") {
          n1 = Math.floor(Math.random() * 99) + 25;
          n2 = Math.floor(Math.random() * 99) + 25;
          ans = n1 * n2;
        } else if (op === "÷") {
          n2 = Math.floor(Math.random() * 50) + 25;
          ans = Math.floor(Math.random() * 50) + 25;
          n1 = n2 * ans;
        } else if (op === "+") {
          n1 = Math.floor(Math.random() * 5000) + 1000;
          n2 = Math.floor(Math.random() * 5000) + 1000;
          ans = n1 + n2;
        } else {
          n1 = Math.floor(Math.random() * 8000) + 2000;
          n2 = Math.floor(Math.random() * 3000) + 1000;
          ans = n1 - n2;
        }
        break;

      default:
        // Fallback to Level 1
        op = "+";
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        ans = n1 + n2;
    }

    return { num1: n1, num2: n2, operator: op, answer: ans };
  };

  // Initialize first question
  useEffect(() => {
    setQuestion(generateQuestion());
  }, [currentLevel]);

  const checkAnswer = () => {
    if (!question) return;

    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === question.answer;

    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'numeracy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'numeracy');
      speak(`Incorrect. The answer is ${question.answer}`);
    }

    setStageTotal(stageTotal + 1);
    setQuestionsInStage(questionsInStage + 1);

    // Check if stage completed (10 questions)
    if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
      completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
    }
  };

  const completeStage = async (correct: number, total: number) => {
    // Record stage completion
    await recordStageCompletion(gameId, correct, total);

    // Reset stage counters
    setStageCorrect(0);
    setStageTotal(0);
    setQuestionsInStage(0);

    // Check if can level up
    if (canLevelUp(gameId)) {
      setShowLevelUp(true);
    }
  };

  const handleNextQuestion = () => {
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback(null);
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    // Generate new question at new level
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback(null);
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>

      {/* Level Display */}
      <div className="mb-6">
        <LevelDisplay
          currentLevel={currentLevel}
          stagesCompleted={stagesCompleted}
          totalStages={50}
          accuracy={accuracy}
          proficiencyThreshold={77}
        />
      </div>

      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">
            <TextWithVoice>🔢 Math Quiz - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl mb-6 font-bold">
            <TextWithVoice>
              {question.num1} {question.operator} {question.num2} = ?
            </TextWithVoice>
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
              <TextWithVoice>Correct! Well done!</TextWithVoice>
            </div>
          )}

          {feedback === "incorrect" && (
            <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
              <X className="w-6 h-6" />
              <TextWithVoice>The answer is {question.answer}</TextWithVoice>
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

        {feedback !== null && (
          <Button
            onClick={handleNextQuestion}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <TextWithVoice>Next Question</TextWithVoice>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {/* Stage Progress Indicator */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Stage Progress</TextWithVoice>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(QUESTIONS_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-full ${
                  i < questionsInStage
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Level Up Modal */}
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