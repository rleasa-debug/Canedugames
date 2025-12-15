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

interface PatternRecognitionProps {
  onBack: () => void;
}

const shapes = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "❤️", "🔷", "🔶"];

export function PatternRecognition({ onBack }: PatternRecognitionProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "pattern";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [pattern, setPattern] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  // Generate pattern based on level difficulty
  const generatePattern = () => {
    let patternLength: number;
    let repetitions: number;
    let useNumbers: boolean;

    switch (currentLevel) {
      case 1: // Simple AB pattern
        patternLength = 2;
        repetitions = 2;
        useNumbers = false;
        break;
      case 2: // ABC pattern
        patternLength = 3;
        repetitions = 2;
        useNumbers = false;
        break;
      case 3: // Longer patterns
        patternLength = 4;
        repetitions = 2;
        useNumbers = false;
        break;
      case 4: // Number patterns (simple)
        patternLength = 2;
        repetitions = 2;
        useNumbers = true;
        break;
      case 5: // Complex shape patterns
        patternLength = 5;
        repetitions = 2;
        useNumbers = false;
        break;
      case 6: // Number sequences (skip counting by 2)
        patternLength = 3;
        repetitions = 2;
        useNumbers = true;
        break;
      case 7: // Very complex patterns
        patternLength = 6;
        repetitions = 2;
        useNumbers = false;
        break;
      case 8: // Number sequences (skip counting by 5)
        patternLength = 4;
        repetitions = 2;
        useNumbers = true;
        break;
      case 9: // Advanced patterns
        patternLength = 7;
        repetitions = 2;
        useNumbers = Math.random() > 0.5;
        break;
      case 10: // Most complex
        patternLength = 8;
        repetitions = 2;
        useNumbers = Math.random() > 0.5;
        break;
      default:
        patternLength = 2;
        repetitions = 2;
        useNumbers = false;
    }

    if (useNumbers && currentLevel >= 4) {
      generateNumberPattern(patternLength, repetitions);
    } else {
      generateShapePattern(patternLength, repetitions);
    }
  };

  const generateShapePattern = (patternLength: number, repetitions: number) => {
    const basePattern: string[] = [];
    const usedShapes = new Set<string>();
    
    for (let i = 0; i < patternLength; i++) {
      let shape;
      do {
        shape = shapes[Math.floor(Math.random() * shapes.length)];
      } while (usedShapes.has(shape) && usedShapes.size < shapes.length);
      
      basePattern.push(shape);
      usedShapes.add(shape);
    }
    
    const fullPattern: string[] = [];
    for (let i = 0; i < repetitions; i++) {
      fullPattern.push(...basePattern);
    }
    
    const correct = basePattern[0];
    setPattern(fullPattern);
    setCorrectAnswer(correct);
    
    // Generate wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      if (randomShape !== correct && !wrongOptions.includes(randomShape)) {
        wrongOptions.push(randomShape);
      }
    }
    
    const allOptions = [...wrongOptions, correct].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const generateNumberPattern = (patternLength: number, repetitions: number) => {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = currentLevel >= 8 ? 5 : currentLevel >= 6 ? 2 : 1;
    
    const basePattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      basePattern.push(String(start + i * step));
    }
    
    const fullPattern: string[] = [];
    for (let i = 0; i < repetitions; i++) {
      fullPattern.push(...basePattern);
    }
    
    const correct = basePattern[0];
    setPattern(fullPattern);
    setCorrectAnswer(correct);
    
    // Generate wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomNum = String(Math.floor(Math.random() * 20) + 1);
      if (randomNum !== correct && !wrongOptions.includes(randomNum) && !basePattern.includes(randomNum)) {
        wrongOptions.push(randomNum);
      }
    }
    
    const allOptions = [...wrongOptions, correct].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    generatePattern();
  }, [currentLevel]);

  const handleAnswer = (answer: string) => {
    if (feedback !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'numeracy');
      speak("Correct! You found the pattern!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'numeracy');
      speak("Try again!");
    }

    setStageTotal(stageTotal + 1);
    setQuestionsInStage(questionsInStage + 1);

    setTimeout(() => {
      if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
        completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
      } else {
        generatePattern();
        setSelectedAnswer(null);
        setFeedback(null);
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
      generatePattern();
      setSelectedAnswer(null);
      setFeedback(null);
    }
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    generatePattern();
    setSelectedAnswer(null);
    setFeedback(null);
  };

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
            <TextWithVoice>🔢 Patterns on the Prairies - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Pattern Display */}
        <div className="mb-8">
          <p className="text-center text-xl text-gray-700 mb-6">
            <TextWithVoice>What comes next in this pattern?</TextWithVoice>
          </p>
          
          <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
            {pattern.map((item, index) => (
              <div
                key={index}
                className="w-16 h-16 flex items-center justify-center text-4xl bg-teal-50 rounded-lg border-2 border-teal-200"
              >
                {item}
              </div>
            ))}
            <div className="w-16 h-16 flex items-center justify-center text-4xl bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed">
              ?
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              variant={selectedAnswer === option ? (feedback === "correct" ? "default" : "destructive") : "outline"}
              className={`h-20 text-4xl ${
                selectedAnswer === option && feedback === "correct"
                  ? "bg-green-500 hover:bg-green-600"
                  : selectedAnswer === option && feedback === "incorrect"
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct! The pattern continues with {correctAnswer}!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>The correct answer is {correctAnswer}!</TextWithVoice>
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
                  i < questionsInStage ? 'bg-teal-600' : 'bg-gray-200'
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