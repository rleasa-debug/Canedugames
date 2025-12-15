import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { Calculator, Trophy, Target, Zap, Plus, Minus } from "lucide-react";

interface MathGameProps {
  onBack: () => void;
}

export function MathGame({ onBack }: MathGameProps) {
  const { recordAnswer } = useScore();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<"+" | "-">("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const generateQuestion = () => {
    const op = Math.random() > 0.5 ? "+" : "-";
    setOperation(op);

    if (op === "+") {
      const n1 = Math.floor(Math.random() * 20) + 1;
      const n2 = Math.floor(Math.random() * 20) + 1;
      setNum1(n1);
      setNum2(n2);
    } else {
      // For subtraction, ensure result is positive
      const n1 = Math.floor(Math.random() * 20) + 10;
      const n2 = Math.floor(Math.random() * n1) + 1;
      setNum1(n1);
      setNum2(n2);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const correctAnswer = operation === "+" ? num1 + num2 : num1 - num2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and negative sign
    if (value === "" || value === "-" || /^-?\d+$/.test(value)) {
      setUserAnswer(value);
      setIsCorrect(null);
    }
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    
    recordAnswer(correct, "numeracy");
    
    if (correct) {
      setScore(score + 1);
    }
    setAttempted(attempted + 1);

    setTimeout(() => {
      generateQuestion();
      setUserAnswer("");
      setIsCorrect(null);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userAnswer.trim()) {
      handleSubmit();
    }
  };

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">
                <TextWithVoice>Counting in the Canadian Shield</TextWithVoice>
              </h1>
              <p className="text-gray-600">Solve addition and subtraction problems</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline">
            Back to Home
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl">{attempted}</div>
            <div className="text-sm text-gray-600">Attempted</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-12 mb-6">
            <div className="flex items-center justify-center gap-6 text-6xl">
              <span className="text-gray-800">{num1}</span>
              <span className={`w-16 h-16 rounded-full flex items-center justify-center ${
                operation === "+" ? "bg-green-500" : "bg-blue-500"
              }`}>
                {operation === "+" ? (
                  <Plus className="w-10 h-10 text-white" />
                ) : (
                  <Minus className="w-10 h-10 text-white" />
                )}
              </span>
              <span className="text-gray-800">{num2}</span>
              <span className="text-gray-400">=</span>
              <span className="text-gray-400">?</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-gray-700 mb-2">
            What is the answer?
          </label>
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-6 py-4 text-3xl text-center border-2 rounded-lg focus:outline-none transition-colors ${
              isCorrect === null
                ? "border-gray-300 focus:border-red-500"
                : isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
            placeholder="?"
            disabled={isCorrect !== null}
            autoFocus
          />

          {isCorrect !== null && (
            <div
              className={`p-4 rounded-lg text-center ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="text-xl mb-2">
                {isCorrect ? "🎉 Perfect! You're a math star!" : "❌ Not quite right."}
              </p>
              {!isCorrect && (
                <p className="text-lg">The correct answer is: <strong>{correctAnswer}</strong></p>
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || isCorrect !== null}
            className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            size="lg"
          >
            {isCorrect !== null ? "Loading next problem..." : "Check Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
