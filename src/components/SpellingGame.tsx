import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { Sparkles, Trophy, Target, Volume2 } from "lucide-react";

interface SpellingGameProps {
  onBack: () => void;
}

const words = [
  { word: "beaver", hint: "A furry animal that builds dams" },
  { word: "maple", hint: "A tree that gives us syrup" },
  { word: "hockey", hint: "Canada's favorite winter sport" },
  { word: "mountain", hint: "A very tall landform" },
  { word: "forest", hint: "Many trees growing together" },
  { word: "province", hint: "A region of Canada, like Ontario" },
  { word: "Toronto", hint: "The largest city in Canada" },
  { word: "Arctic", hint: "The cold northern region" },
  { word: "moose", hint: "A large animal with antlers" },
  { word: "winter", hint: "The coldest season of the year" },
  { word: "Canada", hint: "Our beautiful country" },
  { word: "Pacific", hint: "The ocean on the west coast" },
];

export function SpellingGame({ onBack }: SpellingGameProps) {
  const { recordAnswer } = useScore();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentWord = words[currentWordIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    
    recordAnswer(correct, "literacy");
    
    if (correct) {
      setScore(score + 1);
    }
    setAttempted(attempted + 1);

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput("");
        setIsCorrect(null);
        setShowHint(false);
      } else {
        // Game complete - restart
        setCurrentWordIndex(0);
        setUserInput("");
        setIsCorrect(null);
        setShowHint(false);
      }
    }, 2000);
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">
                <TextWithVoice>Spelling in the Spruce Forest</TextWithVoice>
              </h1>
              <p className="text-gray-600">Listen and spell the word correctly</p>
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
            <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
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
        <div className="mb-8 text-center">
          <div className="text-sm text-gray-600 mb-6">
            Word {currentWordIndex + 1} of {words.length}
          </div>

          <Button
            onClick={() => speak(currentWord.word)}
            className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Hear the Word
          </Button>

          <div className="mb-4">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="sm"
            >
              {showHint ? "Hide" : "Show"} Hint
            </Button>
          </div>

          {showHint && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-lg text-gray-700">💡 {currentWord.hint}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-gray-700 mb-2">
            Spell the word:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-6 py-4 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
              isCorrect === null
                ? "border-gray-300 focus:border-purple-500"
                : isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
            placeholder="Type your spelling..."
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
                {isCorrect ? "🎉 Excellent spelling!" : "❌ Not quite right."}
              </p>
              {!isCorrect && (
                <p className="text-lg">The correct spelling is: <strong>{currentWord.word}</strong></p>
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isCorrect !== null}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            size="lg"
          >
            {isCorrect !== null ? "Loading next word..." : "Check Spelling"}
          </Button>
        </div>
      </div>
    </div>
  );
}
