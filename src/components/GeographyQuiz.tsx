import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";
import canadaMap from "figma:asset/c6e36ea8948174a4343f87e6bb7f6212c39531af.png";

interface GeographyQuizProps {
  onBack: () => void;
}

interface Question {
  question: string;
  options: string[];
  correct: string;
}

// Geography questions organized by level
const questionsByLevel: Record<number, Question[]> = {
  1: [
    { question: "What country do we live in?", options: ["USA", "Canada", "Mexico", "England"], correct: "Canada" },
    { question: "What is Canada's capital city?", options: ["Toronto", "Ottawa", "Montreal", "Vancouver"], correct: "Ottawa" },
    { question: "Which ocean is on Canada's west coast?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: "Pacific" },
  ],
  2: [
    { question: "Which province is the largest?", options: ["Ontario", "Quebec", "BC", "Alberta"], correct: "Quebec" },
    { question: "What is on the Canadian flag?", options: ["Star", "Maple Leaf", "Beaver", "Moose"], correct: "Maple Leaf" },
    { question: "How many provinces does Canada have?", options: ["8", "10", "12", "13"], correct: "10" },
  ],
  3: [
    { question: "What is Ontario's capital city?", options: ["Ottawa", "Toronto", "Hamilton", "Windsor"], correct: "Toronto" },
    { question: "Which province is east of Ontario?", options: ["Manitoba", "Quebec", "Alberta", "BC"], correct: "Quebec" },
    { question: "Which is Canada's smallest province?", options: ["Nova Scotia", "PEI", "New Brunswick", "Yukon"], correct: "PEI" },
  ],
  4: [
    { question: "Which Great Lake is NOT in Ontario?", options: ["Superior", "Huron", "Erie", "Michigan"], correct: "Michigan" },
    { question: "What is British Columbia's capital?", options: ["Vancouver", "Victoria", "Kelowna", "Surrey"], correct: "Victoria" },
    { question: "Which province is known as 'The Prairies'?", options: ["Ontario", "Quebec", "Saskatchewan", "Nova Scotia"], correct: "Saskatchewan" },
  ],
  5: [
    { question: "How many territories does Canada have?", options: ["1", "2", "3", "4"], correct: "3" },
    { question: "What is the capital of Alberta?", options: ["Calgary", "Edmonton", "Red Deer", "Banff"], correct: "Edmonton" },
    { question: "Which province has the most French speakers?", options: ["Ontario", "Quebec", "New Brunswick", "Manitoba"], correct: "Quebec" },
  ],
  6: [
    { question: "What is Canada's newest territory?", options: ["Yukon", "Northwest Territories", "Nunavut", "Labrador"], correct: "Nunavut" },
    { question: "Which province is farthest east?", options: ["Nova Scotia", "New Brunswick", "Quebec", "Newfoundland"], correct: "Newfoundland" },
    { question: "What mountain range is in BC and Alberta?", options: ["Rockies", "Appalachians", "Laurentians", "Coast"], correct: "Rockies" },
  ],
  7: [
    { question: "Which body of water separates PEI from mainland?", options: ["Bay of Fundy", "Northumberland Strait", "Gulf of St. Lawrence", "Hudson Bay"], correct: "Northumberland Strait" },
    { question: "What is the capital of Saskatchewan?", options: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"], correct: "Regina" },
    { question: "Which province is known for the Bay of Fundy?", options: ["Nova Scotia", "New Brunswick", "Quebec", "Newfoundland"], correct: "New Brunswick" },
  ],
  8: [
    { question: "What is the longest river in Canada?", options: ["St. Lawrence", "Mackenzie", "Fraser", "Churchill"], correct: "Mackenzie" },
    { question: "Which Canadian Shield covers much of northern Ontario?", options: ["Precambrian Shield", "Canadian Shield", "Arctic Shield", "Laurentian Shield"], correct: "Canadian Shield" },
    { question: "What is the capital of Manitoba?", options: ["Brandon", "Winnipeg", "Churchill", "Thompson"], correct: "Winnipeg" },
  ],
  9: [
    { question: "What percentage of the world's fresh water is in Canada?", options: ["5%", "10%", "20%", "7%"], correct: "7%" },
    { question: "Which latitude line marks Canada's southernmost point?", options: ["42°N", "49°N", "41°N", "45°N"], correct: "41°N" },
    { question: "What is Canada's largest island?", options: ["Vancouver Island", "Baffin Island", "Newfoundland", "Victoria Island"], correct: "Baffin Island" },
  ],
  10: [
    { question: "How many time zones does Canada have?", options: ["4", "5", "6", "7"], correct: "6" },
    { question: "What is the population density of Canada per km²?", options: ["4", "10", "20", "30"], correct: "4" },
    { question: "Which geological region is the oldest in Canada?", options: ["Canadian Shield", "Cordillera", "Interior Plains", "Appalachian"], correct: "Canadian Shield" },
  ],
};

export function GeographyQuiz({ onBack }: GeographyQuizProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "geography";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateQuestion = () => {
    const levelQuestions = questionsByLevel[currentLevel] || questionsByLevel[1];
    const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const handleAnswer = (answer: string) => {
    if (feedback !== null || !currentQuestion) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correct;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. The answer is ${currentQuestion.correct}`);
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

  if (!currentQuestion) {
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
            <TextWithVoice>🌍 Geography of the Great Lakes - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Canada Map */}
        <div className="mb-8">
          <ImageWithFallback
            src={canadaMap}
            alt="Map of Canada"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
          />
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            <TextWithVoice>{currentQuestion.question}</TextWithVoice>
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              variant={
                selectedAnswer === option
                  ? feedback === "correct"
                    ? "default"
                    : "destructive"
                  : "outline"
              }
              className={`p-6 text-xl h-auto ${
                selectedAnswer === option && feedback === "correct"
                  ? "bg-green-500 hover:bg-green-600"
                  : selectedAnswer === option && feedback === "incorrect"
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
              size="lg"
            >
              <TextWithVoice>{option}</TextWithVoice>
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Incorrect. The answer is {currentQuestion.correct}</TextWithVoice>
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
                  i < questionsInStage ? 'bg-emerald-600' : 'bg-gray-200'
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