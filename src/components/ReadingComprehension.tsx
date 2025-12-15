import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, Volume2 } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface ReadingComprehensionProps {
  onBack: () => void;
}

interface Passage {
  title: string;
  text: string;
  question: string;
  options: string[];
  correct: string;
}

// Reading passages organized by level
const passagesByLevel: Record<number, Passage[]> = {
  1: [
    {
      title: "The Cat",
      text: "The cat is soft. The cat is black. The cat likes milk.",
      question: "What color is the cat?",
      options: ["White", "Black", "Brown", "Gray"],
      correct: "Black"
    },
  ],
  2: [
    {
      title: "The Beaver",
      text: "Beavers are Canada's national animal. They have big teeth. They build dams in rivers. A beaver's home is called a lodge.",
      question: "What is a beaver's home called?",
      options: ["Den", "Nest", "Lodge", "Burrow"],
      correct: "Lodge"
    },
  ],
  3: [
    {
      title: "Four Seasons",
      text: "Ontario has four seasons. Spring brings flowers. Summer is warm. Fall has colorful leaves. Winter has snow. Each season is special!",
      question: "Which season is cold with snow?",
      options: ["Spring", "Summer", "Fall", "Winter"],
      correct: "Winter"
    },
  ],
  4: [
    {
      title: "Niagara Falls",
      text: "Niagara Falls is one of the most famous waterfalls in the world. It is between Ontario and New York. The falls are made of three waterfalls. Millions of people visit every year.",
      question: "Where is Niagara Falls located?",
      options: ["Only Canada", "Between Canada and USA", "Only USA", "Europe"],
      correct: "Between Canada and USA"
    },
  ],
  5: [
    {
      title: "The Maple Leaf",
      text: "The maple leaf is a symbol of Canada. It appears on the Canadian flag. In autumn, maple leaves turn bright red and orange. People make sweet maple syrup from maple trees.",
      question: "What is on the Canadian flag?",
      options: ["A beaver", "A maple leaf", "A moose", "A snowflake"],
      correct: "A maple leaf"
    },
  ],
  6: [
    {
      title: "Hockey in Canada",
      text: "Hockey is Canada's favorite winter sport. The game is played on ice with skates, sticks, and a puck. Players wear protective helmets and pads. The NHL is the professional hockey league where many Canadian kids dream of playing.",
      question: "What equipment do hockey players use?",
      options: ["Bat and ball", "Skates and stick", "Racket", "Gloves only"],
      correct: "Skates and stick"
    },
  ],
  7: [
    {
      title: "Canadian Confederation",
      text: "Canada became a country on July 1, 1867. This is called Confederation. At first, there were only four provinces: Ontario, Quebec, Nova Scotia, and New Brunswick. Over time, more provinces and territories joined to form the Canada we know today.",
      question: "When did Canada become a country?",
      options: ["1867", "1776", "1900", "1945"],
      correct: "1867"
    },
  ],
  8: [
    {
      title: "The Canadian Shield",
      text: "The Canadian Shield is a large geological formation covering much of northern Canada. It contains some of the oldest rocks on Earth, dating back billions of years. This region is rich in minerals and is dotted with thousands of lakes formed by ancient glaciers.",
      question: "What formed the lakes in the Canadian Shield?",
      options: ["Volcanoes", "Glaciers", "Rain", "Rivers"],
      correct: "Glaciers"
    },
  ],
  9: [
    {
      title: "Bilingualism in Canada",
      text: "Canada is officially bilingual, with English and French as its two official languages. This status reflects the country's colonial history and the significant French-speaking population, primarily in Quebec. Federal institutions must provide services in both languages, promoting linguistic diversity and cultural heritage.",
      question: "What are Canada's two official languages?",
      options: ["English and Spanish", "English and French", "French and German", "English and Chinese"],
      correct: "English and French"
    },
  ],
  10: [
    {
      title: "Canadian Federalism",
      text: "Canada's federal system divides governmental powers between the national parliament and provincial legislatures. This constitutional framework, established in 1867, grants provinces jurisdiction over education, healthcare, and natural resources, while the federal government handles national defense, foreign policy, and interprovincial trade. This balance allows regional diversity while maintaining national unity.",
      question: "What does Canada's federal system divide?",
      options: ["Money equally", "Governmental powers", "Land", "Population"],
      correct: "Governmental powers"
    },
  ],
};

export function ReadingComprehension({ onBack }: ReadingComprehensionProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "reading";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 6;

  const generateQuestion = () => {
    const levelPassages = passagesByLevel[currentLevel] || passagesByLevel[1];
    const randomPassage = levelPassages[Math.floor(Math.random() * levelPassages.length)];
    
    setCurrentPassage(randomPassage);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const handleAnswer = (answer: string) => {
    if (feedback !== null || !currentPassage) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentPassage.correct;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. The answer is ${currentPassage.correct}`);
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

  if (!currentPassage) {
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
            <TextWithVoice>📚 Rocky Mountain Reading - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Passage {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Passage */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-blue-700">
              <TextWithVoice>{currentPassage.title}</TextWithVoice>
            </h3>
            <Button
              onClick={() => speak(currentPassage.text)}
              variant="outline"
              size="sm"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              <TextWithVoice>Read Aloud</TextWithVoice>
            </Button>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-lg leading-relaxed text-gray-800">
              <TextWithVoice>{currentPassage.text}</TextWithVoice>
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            <TextWithVoice>{currentPassage.question}</TextWithVoice>
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {currentPassage.options.map((option, index) => (
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
              className={`p-4 text-lg h-auto justify-start ${
                selectedAnswer === option && feedback === "correct"
                  ? "bg-green-500 hover:bg-green-600"
                  : selectedAnswer === option && feedback === "incorrect"
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
              size="lg"
            >
              <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
              <TextWithVoice>{option}</TextWithVoice>
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Excellent reading comprehension!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>The correct answer is: {currentPassage.correct}</TextWithVoice>
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
                  i < questionsInStage ? 'bg-blue-600' : 'bg-gray-200'
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