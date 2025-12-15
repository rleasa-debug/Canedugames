import { useState } from "react";
import { Button } from "./ui/button";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { BookOpen, Trophy, Target, Lightbulb } from "lucide-react";

interface ReadingGameProps {
  onBack: () => void;
}

interface Story {
  title: string;
  text: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const stories: Story[] = [
  {
    title: "The Beaver's Dam",
    text: "Benny the beaver lived by a river in the Rocky Mountains. Every day, he would collect sticks and mud to build his dam. The dam helped create a pond where his family could live safely. Benny worked very hard, and soon his dam was the biggest in the forest!",
    questions: [
      {
        question: "Where did Benny live?",
        options: ["In a tree", "By a river", "In a cave", "On a mountain"],
        correctAnswer: 1,
      },
      {
        question: "What did Benny collect to build his dam?",
        options: ["Rocks and leaves", "Sticks and mud", "Grass and flowers", "Ice and snow"],
        correctAnswer: 1,
      },
      {
        question: "Why did Benny build a dam?",
        options: ["To play on", "To create a pond for his family", "To cross the river", "To catch fish"],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: "Maple Syrup Adventure",
    text: "Sarah loved visiting her grandparents' farm in Quebec. In the spring, they would tap the maple trees to collect sap. Grandpa taught her how the sap is boiled to make delicious maple syrup. Sarah helped pour the syrup into bottles, and she got to take some home for pancakes!",
    questions: [
      {
        question: "Where was the farm located?",
        options: ["Ontario", "Quebec", "Alberta", "British Columbia"],
        correctAnswer: 1,
      },
      {
        question: "When do they collect sap from trees?",
        options: ["Summer", "Fall", "Spring", "Winter"],
        correctAnswer: 2,
      },
      {
        question: "What is maple syrup made from?",
        options: ["Tree bark", "Tree leaves", "Tree sap", "Tree roots"],
        correctAnswer: 2,
      },
    ],
  },
  {
    title: "The Northern Lights",
    text: "Tommy and his dad went camping in the Yukon. At night, they saw the Northern Lights dancing across the sky. The lights were green, purple, and pink. Dad explained that the Northern Lights are caused by particles from the sun. Tommy thought it was the most beautiful thing he had ever seen!",
    questions: [
      {
        question: "Where did Tommy go camping?",
        options: ["The Yukon", "Ontario", "Nova Scotia", "Saskatchewan"],
        correctAnswer: 0,
      },
      {
        question: "What colors were the Northern Lights?",
        options: ["Red, white, and blue", "Green, purple, and pink", "Yellow and orange", "Black and white"],
        correctAnswer: 1,
      },
      {
        question: "What causes the Northern Lights?",
        options: ["Stars", "The moon", "Particles from the sun", "Lightning"],
        correctAnswer: 2,
      },
    ],
  },
];

export function ReadingGame({ onBack }: ReadingGameProps) {
  const { recordAnswer } = useScore();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showStory, setShowStory] = useState(true);

  const currentStory = stories[currentStoryIndex];
  const currentQuestion = currentStory.questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    
    recordAnswer(correct, "literacy");
    
    if (correct) {
      setScore(score + 1);
    }
    setAttempted(attempted + 1);

    setTimeout(() => {
      // Move to next question
      if (currentQuestionIndex < currentStory.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowStory(false);
      } else {
        // Move to next story
        if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex(currentStoryIndex + 1);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setShowStory(true);
        } else {
          // All stories complete - restart
          setCurrentStoryIndex(0);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setShowStory(true);
        }
      }
    }, 2000);
  };

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">
                <TextWithVoice>Rocky Mountain Reading</TextWithVoice>
              </h1>
              <p className="text-gray-600">Read stories and answer questions</p>
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
            <Lightbulb className="w-6 h-6 text-purple-600 mx-auto mb-2" />
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

      {/* Story Display */}
      {showStory && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl mb-4">
              <TextWithVoice>{currentStory.title}</TextWithVoice>
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-xl leading-relaxed">
                <TextWithVoice>{currentStory.text}</TextWithVoice>
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowStory(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
          >
            Answer Questions
          </Button>
        </div>
      )}

      {/* Question Display */}
      {!showStory && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentStory.questions.length}
              </div>
              <Button
                onClick={() => setShowStory(true)}
                variant="outline"
                size="sm"
              >
                📖 Read Story Again
              </Button>
            </div>

            <h3 className="text-2xl mb-6">
              <TextWithVoice>{currentQuestion.question}</TextWithVoice>
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = isAnswered;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      !showResult
                        ? isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                        : isCorrect
                        ? "border-green-500 bg-green-50"
                        : isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 opacity-50"
                    }`}
                  >
                    <span className="text-lg">
                      {showResult && isCorrect && "✅ "}
                      {showResult && isSelected && !isCorrect && "❌ "}
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div
                className={`mt-6 p-4 rounded-lg text-center ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <p className="text-xl">
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? "🎉 Excellent! You read carefully!"
                    : "❌ Not quite. Try reading more carefully next time!"}
                </p>
              </div>
            )}

            {!isAnswered && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full mt-6 py-6 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                Submit Answer
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
