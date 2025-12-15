import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, HelpCircle } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface AngleBisectorGameProps {
  onBack: () => void;
}

interface AngleProblem {
  type: "find-half" | "find-whole" | "find-both" | "algebraic";
  description: string;
  givenAngle?: number;
  givenPart?: number;
  algebraicExpression?: string;
  answers: number[];
  questionLabels: string[];
  hint: string;
}

// Problems by level
const problemsByLevel: Record<number, AngleProblem[]> = {
  1: [
    // Grade 1: Simple counting with split shapes
    {
      type: "find-half",
      description: "A circle is cut in half. Each half is equal. If you have 10 candies total, how many in each half?",
      givenAngle: 10,
      answers: [5, 5],
      questionLabels: ["Half 1 = ", "Half 2 = "],
      hint: "When you split something in half, divide by 2. What is 10 ÷ 2?"
    },
    {
      type: "find-half",
      description: "A pizza is cut in half. Each piece is the same size. If it has 8 slices total, how many in each half?",
      givenAngle: 8,
      answers: [4, 4],
      questionLabels: ["Half 1 = ", "Half 2 = "],
      hint: "Half means equal parts. 8 ÷ 2 = ?"
    }
  ],
  2: [
    // Grade 2: Introduction to degrees with simple angles
    {
      type: "find-half",
      description: "A clock shows 60 degrees. If we split it in half, what is each part?",
      givenAngle: 60,
      answers: [30, 30],
      questionLabels: ["Part 1 = ", "Part 2 = "],
      hint: "Split 60 into two equal parts. What is 60 ÷ 2?"
    },
    {
      type: "find-half",
      description: "An angle measures 40 degrees. Split it in half. What is each half?",
      givenAngle: 40,
      answers: [20, 20],
      questionLabels: ["Half 1 = ", "Half 2 = "],
      hint: "Divide 40 by 2 to get each half."
    }
  ],
  3: [
    // Grade 3: Introducing bisector terminology
    {
      type: "find-half",
      description: "AD bisects angle BAC. Angle BAC = 80°",
      givenAngle: 80,
      answers: [40, 40],
      questionLabels: ["∠BAD = ", "∠DAC = "],
      hint: "Bisect means to cut in half. What is 80 ÷ 2?"
    },
    {
      type: "find-half",
      description: "AD bisects angle BAC. Angle BAC = 100°",
      givenAngle: 100,
      answers: [50, 50],
      questionLabels: ["∠BAD = ", "∠DAC = "],
      hint: "When an angle is bisected, divide by 2. What is 100 ÷ 2?"
    }
  ],
  4: [
    // Grade 4: Finding whole from part
    {
      type: "find-whole",
      description: "AD bisects angle BAC. Angle BAD = 25°",
      givenPart: 25,
      answers: [25, 50],
      questionLabels: ["∠DAC = ", "∠BAC = "],
      hint: "If AD bisects BAC, then BAD = DAC. The whole angle is the sum!"
    },
    {
      type: "find-whole",
      description: "AD bisects angle BAC. Angle DAC = 35°",
      givenPart: 35,
      answers: [35, 70],
      questionLabels: ["∠BAD = ", "∠BAC = "],
      hint: "Both halves are equal. Add them to find the whole angle."
    }
  ],
  5: [
    // Grade 5: Larger numbers and mixed problems
    {
      type: "find-half",
      description: "AD bisects angle BAC. Angle BAC = 120°",
      givenAngle: 120,
      answers: [60, 60],
      questionLabels: ["∠BAD = ", "∠DAC = "],
      hint: "120° divided by 2 equals what?"
    },
    {
      type: "find-whole",
      description: "AD bisects angle BAC. Angle BAD = 48°",
      givenPart: 48,
      answers: [48, 96],
      questionLabels: ["∠DAC = ", "∠BAC = "],
      hint: "The two parts are equal, so multiply by 2 for the whole."
    }
  ],
  6: [
    // Grade 6: Double bisection
    {
      type: "find-both",
      description: "AD bisects angle BAC. Angle BAC = 90°. Also, AE bisects angle BAD.",
      givenAngle: 90,
      answers: [45, 22.5],
      questionLabels: ["∠BAD = ", "∠BAE = "],
      hint: "First find BAD (half of 90°), then find BAE (half of BAD)."
    },
    {
      type: "find-both",
      description: "AD bisects angle BAC. Angle BAD = 30°. Find angle BAC and angle DAC.",
      givenPart: 30,
      answers: [60, 30],
      questionLabels: ["∠BAC = ", "∠DAC = "],
      hint: "BAC is double BAD. DAC equals BAD because of bisection."
    }
  ],
  7: [
    // Grade 7: Introduction to algebra
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAD = 2x and angle DAC = 50°. Find x.",
      algebraicExpression: "2x = 50",
      answers: [25, 50],
      questionLabels: ["x = ", "∠BAC = "],
      hint: "Since AD bisects BAC, BAD = DAC. So 2x = 50. Solve for x!"
    },
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAC = 100°. Angle BAD = 3x. Find x.",
      algebraicExpression: "3x = 50",
      answers: [16.67, 50],
      questionLabels: ["x = ", "∠BAD = "],
      hint: "BAD is half of BAC. So 3x = 50. Find x, then round to 2 decimals."
    }
  ],
  8: [
    // Grade 8: More complex algebra
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAD = (x + 10)° and angle DAC = 40°. Find x.",
      algebraicExpression: "x + 10 = 40",
      answers: [30, 80],
      questionLabels: ["x = ", "∠BAC = "],
      hint: "Set up equation: x + 10 = 40. Solve for x, then find BAC!"
    },
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAC = 110°. Angle DAC = (2x - 5)°. Find x.",
      algebraicExpression: "2x - 5 = 55",
      answers: [30, 55],
      questionLabels: ["x = ", "∠DAC = "],
      hint: "DAC is half of BAC = 55°. So 2x - 5 = 55."
    }
  ],
  9: [
    // Grade 9: Two-variable equations
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAD = (4x - 10)° and angle DAC = (2x + 20)°. Find x.",
      algebraicExpression: "4x - 10 = 2x + 20",
      answers: [15, 50, 100],
      questionLabels: ["x = ", "∠BAD = ", "∠BAC = "],
      hint: "Set the two expressions equal: 4x - 10 = 2x + 20. Solve for x!"
    },
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAD = 5x and angle BAC = (8x + 20)°. Find x.",
      algebraicExpression: "2(5x) = 8x + 20",
      answers: [10, 50, 100],
      questionLabels: ["x = ", "∠BAD = ", "∠BAC = "],
      hint: "BAC is twice BAD. So 2(5x) = 8x + 20. Simplify: 10x = 8x + 20."
    }
  ],
  10: [
    // Grade 10: Advanced problems
    {
      type: "algebraic",
      description: "AD bisects angle BAC. Angle BAD = (7x - 15)° and angle DAC = (4x + 18)°. Find all values.",
      algebraicExpression: "7x - 15 = 4x + 18",
      answers: [11, 62, 124],
      questionLabels: ["x = ", "∠BAD = ", "∠BAC = "],
      hint: "Set equal: 7x - 15 = 4x + 18. Subtract 4x from both sides, then add 15."
    },
    {
      type: "algebraic",
      description: "AD bisects angle BAC. AE bisects angle BAD. Angle BAC = (10x + 20)° and angle BAE = 35°. Find x.",
      algebraicExpression: "Complex",
      answers: [10, 120, 60],
      questionLabels: ["x = ", "∠BAC = ", "∠BAD = "],
      hint: "BAE = BAC ÷ 4 (two bisections). So 35 = (10x + 20) ÷ 4. Multiply both sides by 4!"
    }
  ],
};

export function AngleBisectorGame({ onBack }: AngleBisectorGameProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "anglebisector";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentProblem, setCurrentProblem] = useState<AngleProblem | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateProblem = () => {
    const levelProblems = problemsByLevel[currentLevel] || problemsByLevel[1];
    const randomProblem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
    
    setCurrentProblem(randomProblem);
    setUserAnswers(new Array(randomProblem.answers.length).fill(""));
    setFeedback(null);
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem();
  }, [currentLevel]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (!currentProblem) return;

    // Check if all answers are filled
    if (userAnswers.some(ans => ans === "")) {
      speak("Please fill in all answers!");
      return;
    }

    // Check each answer (allow small rounding differences)
    const allCorrect = currentProblem.answers.every((correctAnswer, index) => {
      const userAnswer = parseFloat(userAnswers[index]);
      return Math.abs(userAnswer - correctAnswer) < 0.5; // Allow 0.5 degree tolerance
    });

    if (allCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'numeracy');
      speak("Excellent! You found all the angle measures correctly!");
      
      setStageTotal(stageTotal + 1);
      setQuestionsInStage(questionsInStage + 1);

      setTimeout(() => {
        if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
          completeStage(stageCorrect + 1, stageTotal + 1);
        } else {
          generateProblem();
        }
      }, 2000);
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'numeracy');
      setStageTotal(stageTotal + 1);
      setQuestionsInStage(questionsInStage + 1);
      speak("Not quite right. Check your work and try the next problem.");
      
      setTimeout(() => {
        if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
          completeStage(stageCorrect, stageTotal + 1);
        } else {
          generateProblem();
        }
      }, 2500);
    }
  };

  const completeStage = async (correct: number, total: number) => {
    await recordStageCompletion(gameId, correct, total);
    
    setStageCorrect(0);
    setStageTotal(0);
    setQuestionsInStage(0);

    if (canLevelUp(gameId)) {
      setShowLevelUp(true);
    } else {
      generateProblem();
    }
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    generateProblem();
  };

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-gray-600">
          Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}
        </div>
      </div>

      <div className="mb-3">
        <LevelDisplay
          currentLevel={currentLevel}
          stagesCompleted={stagesCompleted}
          totalStages={50}
          accuracy={accuracy}
          proficiencyThreshold={77}
        />
      </div>

      <Card className="p-4">
        <div className="text-center mb-3">
          <h2 className="text-2xl">
            <TextWithVoice>
              {currentLevel <= 2 ? "Splitting in Half" : 
               currentLevel <= 5 ? "Angle Bisector Challenge" : 
               "Advanced Angle Bisector"} - Level {currentLevel}
            </TextWithVoice>
          </h2>
        </div>

        {/* Main Game Layout - Two Column */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column: Diagram and Problem */}
          <div className="space-y-3">
            {/* Visual Angle Diagram */}
            <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
              <svg width="240" height="200" viewBox="0 0 300 250" className="mx-auto">
                {/* Angle rays */}
                <line x1="150" y1="200" x2="50" y2="50" stroke="#2563eb" strokeWidth="3" />
                <line x1="150" y1="200" x2="250" y2="50" stroke="#2563eb" strokeWidth="3" />
                <line x1="150" y1="200" x2="150" y2="30" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
                
                {/* Points */}
                <circle cx="50" cy="50" r="4" fill="#2563eb" />
                <circle cx="250" cy="50" r="4" fill="#2563eb" />
                <circle cx="150" cy="30" r="4" fill="#dc2626" />
                <circle cx="150" cy="200" r="5" fill="#000" />
                
                {/* Labels */}
                <text x="40" y="40" fontSize="18" fill="#2563eb" fontWeight="bold">B</text>
                <text x="255" y="40" fontSize="18" fill="#2563eb" fontWeight="bold">C</text>
                <text x="155" y="25" fontSize="18" fill="#dc2626" fontWeight="bold">D</text>
                <text x="155" y="220" fontSize="18" fill="#000" fontWeight="bold">A</text>
                
                {/* Angle arc */}
                <path
                  d="M 100 170 Q 120 150 150 150"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                <path
                  d="M 150 150 Q 180 150 200 170"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                
                {/* Bisector label */}
                <text x="120" y="110" fontSize="14" fill="#dc2626" fontStyle="italic">bisector</text>
              </svg>
            </div>

            {/* Problem Description */}
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-center leading-snug">
                <TextWithVoice>{currentProblem.description}</TextWithVoice>
              </p>
            </div>

            {/* Key Concept Box */}
            <div className="p-3 bg-purple-50 border-2 border-purple-300 rounded-lg">
              <h4 className="font-semibold text-sm mb-1 text-purple-900">
                <TextWithVoice>Key Concept:</TextWithVoice>
              </h4>
              <p className="text-xs text-gray-700 leading-snug">
                <TextWithVoice>
                  An angle bisector divides an angle into two equal parts. 
                  If AD bisects ∠BAC, then ∠BAD = ∠DAC.
                </TextWithVoice>
              </p>
            </div>
          </div>

          {/* Right Column: Answers and Actions */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              {/* Answer Inputs */}
              <div>
                <h3 className="text-lg mb-3 text-center font-semibold">
                  <TextWithVoice>Find the missing angles:</TextWithVoice>
                </h3>
                <div className="space-y-3">
                  {currentProblem.questionLabels.map((label, index) => (
                    <div key={index} className="flex items-center justify-center gap-2">
                      <label className="text-base min-w-[100px] text-right font-medium">
                        <TextWithVoice>{label}</TextWithVoice>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={userAnswers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={feedback !== null}
                        className="w-28 px-3 py-2 border-2 border-gray-300 rounded-lg text-base text-center focus:border-blue-500 focus:outline-none"
                        placeholder="?"
                      />
                      <span className="text-base">°</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hint Section */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  disabled={feedback !== null}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
                {showHint && (
                  <div className="mt-2 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p className="text-xs text-gray-700">
                      <TextWithVoice>{currentProblem.hint}</TextWithVoice>
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {feedback === "correct" && (
                <div className="text-green-600 text-base flex items-center justify-center gap-2 bg-green-50 p-3 rounded-lg">
                  <Check className="w-5 h-5" />
                  <TextWithVoice>Perfect! Great work!</TextWithVoice>
                </div>
              )}

              {feedback === "incorrect" && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <X className="w-5 h-5" />
                    <TextWithVoice>Not quite right.</TextWithVoice>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Correct: {currentProblem.answers.map((ans, i) => 
                      `${currentProblem.questionLabels[i]}${ans}°`
                    ).join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button and Progress */}
            <div className="space-y-3 mt-4">
              {feedback === null && (
                <div className="text-center">
                  <Button
                    onClick={checkAnswers}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    Check Answers
                  </Button>
                </div>
              )}

              {/* Stage Progress */}
              <div className="pt-3 border-t">
                <div className="text-xs text-gray-600 text-center mb-2">
                  <TextWithVoice>Stage Progress</TextWithVoice>
                </div>
                <div className="flex gap-1 justify-center">
                  {[...Array(QUESTIONS_PER_STAGE)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full ${
                        i < questionsInStage ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
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