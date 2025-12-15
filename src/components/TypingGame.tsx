import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { Keyboard, Trophy, Target, Zap } from "lucide-react";

interface TypingGameProps {
  onBack: () => void;
}

const sentences = [
  "The polar bear swims in the Arctic Ocean.",
  "Maple syrup comes from maple trees in Canada.",
  "The Rocky Mountains are very tall and beautiful.",
  "Beavers build dams with sticks and mud.",
  "The Northern Lights dance across the sky.",
  "Canada has ten provinces and three territories.",
  "Moose are the largest members of the deer family.",
  "The CN Tower is a famous landmark in Toronto.",
  "Hockey is Canada's most popular winter sport.",
  "Niagara Falls is on the border of Canada and the USA.",
];

export function TypingGame({ onBack }: TypingGameProps) {
  const { recordAnswer } = useScore();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSentence = sentences[currentSentenceIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSentenceIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    const correct = userInput.trim() === currentSentence;
    setIsCorrect(correct);
    
    recordAnswer(correct, "literacy");
    
    if (correct) {
      setScore(score + 1);
    }
    setAttempted(attempted + 1);

    setTimeout(() => {
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setUserInput("");
        setIsCorrect(null);
      } else {
        // Game complete
        setCurrentSentenceIndex(0);
        setUserInput("");
        setIsCorrect(null);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim()) {
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Keyboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">
                <TextWithVoice>Typing on the Tundra</TextWithVoice>
              </h1>
              <p className="text-gray-600">Type the sentence exactly as shown</p>
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
          <div className="text-sm text-gray-600 mb-2">
            Sentence {currentSentenceIndex + 1} of {sentences.length}
          </div>
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <p className="text-2xl text-center">
              <TextWithVoice>{currentSentence}</TextWithVoice>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-gray-700 mb-2">
            Type the sentence here:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-6 py-4 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
              isCorrect === null
                ? "border-gray-300 focus:border-blue-500"
                : isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
            placeholder="Start typing..."
            disabled={isCorrect !== null}
          />

          {isCorrect !== null && (
            <div
              className={`p-4 rounded-lg text-center ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="text-xl">
                {isCorrect ? "🎉 Perfect! Great typing!" : "❌ Not quite right. Try the next one!"}
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isCorrect !== null}
            className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            size="lg"
          >
            {isCorrect !== null ? "Loading next..." : "Check Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
