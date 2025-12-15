import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, MapPin } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface MappingMapleLeafProps {
  onBack: () => void;
}

interface LocationQuestion {
  question: string;
  options: string[];
  correct: string;
  emoji: string;
}

// Canadian geography questions by level
const questionsByLevel: Record<number, LocationQuestion[]> = {
  1: [
    { question: "What is the capital of Canada?", options: ["Toronto", "Ottawa", "Montreal", "Vancouver"], correct: "Ottawa", emoji: "🏛️" },
    { question: "Which leaf is on Canada's flag?", options: ["Oak", "Maple", "Pine", "Birch"], correct: "Maple", emoji: "🍃" },
    { question: "What country is north of the USA?", options: ["Mexico", "Canada", "Greenland", "Alaska"], correct: "Canada", emoji: "🗺️" },
    { question: "What are Canada's two official languages?", options: ["English & Spanish", "English & French", "French & Spanish", "English only"], correct: "English & French", emoji: "💬" },
    { question: "How many provinces does Canada have?", options: ["10", "12", "8", "13"], correct: "10", emoji: "📍" },
    { question: "What is Canada's national animal?", options: ["Moose", "Bear", "Beaver", "Eagle"], correct: "Beaver", emoji: "🦫" },
    { question: "What color is Canada's flag?", options: ["Blue & White", "Red & White", "Red & Blue", "Green & White"], correct: "Red & White", emoji: "🇨🇦" },
    { question: "Which ocean is on Canada's east coast?", options: ["Pacific", "Atlantic", "Arctic", "Indian"], correct: "Atlantic", emoji: "🌊" },
    { question: "What sport did Canada invent?", options: ["Baseball", "Basketball", "Hockey", "Football"], correct: "Hockey", emoji: "🏒" },
    { question: "What is Canada's largest province?", options: ["Ontario", "Quebec", "BC", "Alberta"], correct: "Quebec", emoji: "📏" },
  ],
  2: [
    { question: "Which province has the CN Tower?", options: ["Quebec", "Ontario", "BC", "Alberta"], correct: "Ontario", emoji: "🏗️" },
    { question: "What ocean is on Canada's west coast?", options: ["Atlantic", "Pacific", "Arctic", "Indian"], correct: "Pacific", emoji: "🌊" },
    { question: "What is the capital of Ontario?", options: ["Ottawa", "Toronto", "Hamilton", "London"], correct: "Toronto", emoji: "🏙️" },
    { question: "Which province is known for maple syrup?", options: ["BC", "Alberta", "Quebec", "Manitoba"], correct: "Quebec", emoji: "🍁" },
    { question: "What are the indigenous people of the Arctic called?", options: ["Inuit", "Metis", "Cree", "Mohawk"], correct: "Inuit", emoji: "❄️" },
    { question: "How many territories does Canada have?", options: ["2", "3", "4", "5"], correct: "3", emoji: "🗺️" },
    { question: "What is Canada's national winter sport?", options: ["Skiing", "Hockey", "Curling", "Skating"], correct: "Hockey", emoji: "🏒" },
    { question: "Which Great Lake borders Ontario?", options: ["Lake Michigan", "Lake Superior", "Lake Erie", "All of them"], correct: "All of them", emoji: "💧" },
    { question: "What mountains are in Western Canada?", options: ["Appalachians", "Rockies", "Andes", "Alps"], correct: "Rockies", emoji: "⛰️" },
    { question: "What is Canada's national summer sport?", options: ["Baseball", "Lacrosse", "Soccer", "Tennis"], correct: "Lacrosse", emoji: "🥍" },
  ],
  3: [
    { question: "What is Canada's largest city?", options: ["Montreal", "Vancouver", "Toronto", "Calgary"], correct: "Toronto", emoji: "🏙️" },
    { question: "Which mountains are in BC and Alberta?", options: ["Rockies", "Appalachians", "Alps", "Andes"], correct: "Rockies", emoji: "⛰️" },
    { question: "What is the capital of Quebec?", options: ["Montreal", "Quebec City", "Laval", "Gatineau"], correct: "Quebec City", emoji: "🏰" },
    { question: "Which province is known as 'The Prairies'?", options: ["Ontario", "Saskatchewan", "BC", "Quebec"], correct: "Saskatchewan", emoji: "🌾" },
    { question: "What is Canada's smallest province?", options: ["PEI", "Nova Scotia", "New Brunswick", "Newfoundland"], correct: "PEI", emoji: "🏝️" },
    { question: "Which city hosted the 2010 Winter Olympics?", options: ["Toronto", "Montreal", "Vancouver", "Calgary"], correct: "Vancouver", emoji: "⛷️" },
    { question: "What is the Trans-Canada Highway?", options: ["A train route", "A river", "A road", "A pipeline"], correct: "A road", emoji: "🛣️" },
    { question: "Which province has the most lakes?", options: ["BC", "Ontario", "Manitoba", "Quebec"], correct: "Ontario", emoji: "💧" },
    { question: "What is Canada's motto?", options: ["Peace & Order", "A Mari Usque Ad Mare", "True North", "Unity"], correct: "A Mari Usque Ad Mare", emoji: "🇨🇦" },
    { question: "Which animal is on the Canadian quarter?", options: ["Beaver", "Moose", "Caribou", "Bear"], correct: "Caribou", emoji: "🦌" },
  ],
  4: [
    { question: "Which Great Lake is entirely in Canada?", options: ["Erie", "Ontario", "Michigan", "Huron"], correct: "Ontario", emoji: "💧" },
    { question: "What is the capital of British Columbia?", options: ["Vancouver", "Victoria", "Kelowna", "Surrey"], correct: "Victoria", emoji: "🏝️" },
    { question: "What is the capital of Alberta?", options: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"], correct: "Edmonton", emoji: "🏟️" },
    { question: "Which province was the last to join Canada?", options: ["BC", "Alberta", "Newfoundland", "PEI"], correct: "Newfoundland", emoji: "🎣" },
    { question: "What is the largest city in Quebec?", options: ["Quebec City", "Montreal", "Laval", "Gatineau"], correct: "Montreal", emoji: "🏙️" },
    { question: "Which ocean is at Canada's north?", options: ["Pacific", "Atlantic", "Arctic", "Southern"], correct: "Arctic", emoji: "🧊" },
    { question: "What is Canada's national tree?", options: ["Oak", "Pine", "Maple", "Birch"], correct: "Maple", emoji: "🍁" },
    { question: "Which province has Anne of Green Gables?", options: ["Nova Scotia", "PEI", "New Brunswick", "Newfoundland"], correct: "PEI", emoji: "📚" },
    { question: "What is the capital of Nova Scotia?", options: ["Sydney", "Halifax", "Dartmouth", "Truro"], correct: "Halifax", emoji: "⚓" },
    { question: "Which prairie province is in the middle?", options: ["Alberta", "Saskatchewan", "Manitoba", "Ontario"], correct: "Saskatchewan", emoji: "🌾" },
  ],
  5: [
    { question: "What famous waterfall is between Canada and USA?", options: ["Victoria Falls", "Niagara Falls", "Angel Falls", "Iguazu Falls"], correct: "Niagara Falls", emoji: "💦" },
    { question: "Which province is the largest by area?", options: ["Ontario", "Quebec", "BC", "Alberta"], correct: "Quebec", emoji: "📏" },
    { question: "What is the capital of Manitoba?", options: ["Brandon", "Winnipeg", "Churchill", "Thompson"], correct: "Winnipeg", emoji: "🏛️" },
    { question: "Which province has the Bay of Fundy?", options: ["Nova Scotia", "New Brunswick", "Quebec", "Newfoundland"], correct: "New Brunswick", emoji: "🌊" },
    { question: "What is Canada's longest river system?", options: ["St. Lawrence", "Mackenzie-Peace", "Fraser", "Saskatchewan"], correct: "Mackenzie-Peace", emoji: "🏞️" },
    { question: "Which city is known as 'Cowtown'?", options: ["Edmonton", "Calgary", "Regina", "Saskatoon"], correct: "Calgary", emoji: "🤠" },
    { question: "What is the capital of Saskatchewan?", options: ["Saskatoon", "Regina", "Moose Jaw", "Prince Albert"], correct: "Regina", emoji: "👑" },
    { question: "Which lake is the largest in Canada?", options: ["Lake Superior", "Great Bear Lake", "Great Slave Lake", "Lake Winnipeg"], correct: "Great Bear Lake", emoji: "💧" },
    { question: "What is Nunavut's capital?", options: ["Yellowknife", "Iqaluit", "Whitehorse", "Inuvik"], correct: "Iqaluit", emoji: "❄️" },
    { question: "Which province joined Confederation first?", options: ["Ontario", "Quebec", "Nova Scotia", "All in 1867"], correct: "All in 1867", emoji: "🇨🇦" },
  ],
  6: [
    { question: "What is Canada's newest territory?", options: ["Yukon", "Northwest Territories", "Nunavut", "Labrador"], correct: "Nunavut", emoji: "❄️" },
    { question: "Which bay is in northern Canada?", options: ["Bay of Fundy", "James Bay", "Hudson Bay", "Georgian Bay"], correct: "Hudson Bay", emoji: "🧊" },
    { question: "What is the capital of Newfoundland and Labrador?", options: ["Corner Brook", "St. John's", "Gander", "Happy Valley"], correct: "St. John's", emoji: "🎣" },
    { question: "Which province has the longest coastline?", options: ["BC", "Newfoundland", "Nova Scotia", "Quebec"], correct: "Newfoundland", emoji: "🌊" },
    { question: "What is the capital of New Brunswick?", options: ["Moncton", "Saint John", "Fredericton", "Bathurst"], correct: "Fredericton", emoji: "🏛️" },
    { question: "Which territory has the midnight sun?", options: ["Yukon", "Nunavut", "NWT", "All territories"], correct: "All territories", emoji: "☀️" },
    { question: "What is Canada's highest mountain?", options: ["Mount Robson", "Mount Logan", "Mount Columbia", "Mount Assiniboine"], correct: "Mount Logan", emoji: "⛰️" },
    { question: "Which province has the most national parks?", options: ["BC", "Alberta", "Quebec", "Ontario"], correct: "BC", emoji: "🏞️" },
    { question: "What is the capital of PEI?", options: ["Summerside", "Charlottetown", "Stratford", "Cornwall"], correct: "Charlottetown", emoji: "🏝️" },
    { question: "Which Great Lake is the largest?", options: ["Superior", "Huron", "Michigan", "Ontario"], correct: "Superior", emoji: "💧" },
  ],
  7: [
    { question: "What is the capital of Alberta?", options: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"], correct: "Edmonton", emoji: "🏟️" },
    { question: "Which province has the most French speakers?", options: ["Ontario", "Quebec", "New Brunswick", "Manitoba"], correct: "Quebec", emoji: "🇫🇷" },
    { question: "What is the Yukon's capital?", options: ["Dawson City", "Whitehorse", "Watson Lake", "Haines Junction"], correct: "Whitehorse", emoji: "🐴" },
    { question: "Which province has Banff National Park?", options: ["BC", "Alberta", "Saskatchewan", "Yukon"], correct: "Alberta", emoji: "🦌" },
    { question: "What is the Northwest Territories' capital?", options: ["Yellowknife", "Hay River", "Inuvik", "Fort Smith"], correct: "Yellowknife", emoji: "💎" },
    { question: "Which province has dinosaur fossils?", options: ["BC", "Alberta", "Saskatchewan", "Manitoba"], correct: "Alberta", emoji: "🦕" },
    { question: "What strait separates Newfoundland from Labrador?", options: ["Cabot Strait", "Belle Isle Strait", "Davis Strait", "Hudson Strait"], correct: "Belle Isle Strait", emoji: "🌊" },
    { question: "Which province has the oldest European settlement?", options: ["Quebec", "Nova Scotia", "Newfoundland", "New Brunswick"], correct: "Newfoundland", emoji: "⚓" },
    { question: "What is Canada's second largest city?", options: ["Vancouver", "Montreal", "Calgary", "Ottawa"], correct: "Montreal", emoji: "🏙️" },
    { question: "Which province grows the most wheat?", options: ["Alberta", "Saskatchewan", "Manitoba", "Ontario"], correct: "Saskatchewan", emoji: "🌾" },
  ],
  8: [
    { question: "What is the longest river in Canada?", options: ["St. Lawrence", "Mackenzie", "Fraser", "Saskatchewan"], correct: "Mackenzie", emoji: "🏞️" },
    { question: "Which geological formation covers northern Ontario?", options: ["Great Plains", "Canadian Shield", "Prairies", "Cordillera"], correct: "Canadian Shield", emoji: "🪨" },
    { question: "What is the population of Canada (approx)?", options: ["30 million", "38 million", "45 million", "50 million"], correct: "38 million", emoji: "👥" },
    { question: "Which province has the oil sands?", options: ["Saskatchewan", "Alberta", "BC", "Manitoba"], correct: "Alberta", emoji: "🛢️" },
    { question: "What is the St. Lawrence River used for?", options: ["Drinking water", "Shipping route", "Hydropower", "All of these"], correct: "All of these", emoji: "🚢" },
    { question: "Which province has the Grand Banks?", options: ["Nova Scotia", "Newfoundland", "New Brunswick", "PEI"], correct: "Newfoundland", emoji: "🎣" },
    { question: "What is Canada's population density?", options: ["Very low", "Low", "Medium", "High"], correct: "Very low", emoji: "🗺️" },
    { question: "Which province has the most hydroelectric power?", options: ["BC", "Quebec", "Ontario", "Manitoba"], correct: "Quebec", emoji: "⚡" },
    { question: "What biome covers most of northern Canada?", options: ["Tundra", "Boreal forest", "Grassland", "Desert"], correct: "Tundra", emoji: "❄️" },
    { question: "Which province has the warmest climate?", options: ["Ontario", "BC", "Nova Scotia", "Alberta"], correct: "BC", emoji: "🌡️" },
  ],
  9: [
    { question: "How many time zones does Canada span?", options: ["4", "5", "6", "7"], correct: "6", emoji: "🕐" },
    { question: "What is Canada's largest island?", options: ["Vancouver Island", "Baffin Island", "Newfoundland", "Victoria Island"], correct: "Baffin Island", emoji: "🏝️" },
    { question: "Which region has permafrost?", options: ["Prairies", "Maritimes", "Arctic", "Great Lakes"], correct: "Arctic", emoji: "🧊" },
    { question: "What is the Continental Divide?", options: ["A river", "A mountain range", "A watershed boundary", "A highway"], correct: "A watershed boundary", emoji: "⛰️" },
    { question: "Which province has the most diverse ecosystems?", options: ["Ontario", "BC", "Quebec", "Alberta"], correct: "BC", emoji: "🌲" },
    { question: "What is Canada's area in km²?", options: ["8 million", "10 million", "12 million", "15 million"], correct: "10 million", emoji: "📏" },
    { question: "Which province is the most densely populated?", options: ["Ontario", "Quebec", "BC", "PEI"], correct: "PEI", emoji: "👥" },
    { question: "What is the boreal forest?", options: ["A rainforest", "A coniferous forest", "A deciduous forest", "A grassland"], correct: "A coniferous forest", emoji: "🌲" },
    { question: "Which river forms part of the USA border?", options: ["Fraser", "St. Lawrence", "Mackenzie", "Churchill"], correct: "St. Lawrence", emoji: "🏞️" },
    { question: "What is Canada's rank by world area?", options: ["1st", "2nd", "3rd", "4th"], correct: "2nd", emoji: "🌍" },
  ],
  10: [
    { question: "What percentage of world's fresh water is in Canada?", options: ["5%", "7%", "10%", "15%"], correct: "7%", emoji: "💧" },
    { question: "Which parallel marks most of Canada-US border?", options: ["45th", "48th", "49th", "50th"], correct: "49th", emoji: "🌐" },
    { question: "What is the Ring of Fire?", options: ["A volcano", "A mineral deposit", "A forest fire region", "An aurora zone"], correct: "A mineral deposit", emoji: "💎" },
    { question: "Which province has the oldest rocks on Earth?", options: ["Ontario", "Quebec", "NWT", "Nunavut"], correct: "NWT", emoji: "🪨" },
    { question: "What is Canada's GNP ranking globally?", options: ["Top 5", "Top 10", "Top 15", "Top 20"], correct: "Top 10", emoji: "💰" },
    { question: "Which Canadian city is furthest north?", options: ["Iqaluit", "Alert", "Resolute", "Grise Fiord"], correct: "Alert", emoji: "🧭" },
    { question: "What is the Canadian Shield made of?", options: ["Limestone", "Granite", "Sandstone", "Volcanic rock"], correct: "Granite", emoji: "🪨" },
    { question: "How long is the Canada-US border?", options: ["5,525 km", "8,891 km", "10,000 km", "12,000 km"], correct: "8,891 km", emoji: "🌐" },
    { question: "Which province has the most UNESCO sites?", options: ["Ontario", "Quebec", "BC", "Alberta"], correct: "Quebec", emoji: "🏛️" },
    { question: "What is Canada's forest coverage?", options: ["25%", "35%", "40%", "50%"], correct: "35%", emoji: "🌲" },
  ],
};

export function MappingMapleLeaf({ onBack }: MappingMapleLeafProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "mapleleaf";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentQuestion, setCurrentQuestion] = useState<LocationQuestion | null>(null);
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
            <TextWithVoice>Cross Country Canada - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Canada Map Header with themed styling */}
        <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 mb-8 border-2 border-red-200">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl">🍁</span>
            <span className="text-6xl">{currentQuestion.emoji}</span>
            <span className="text-5xl">🍁</span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 text-center">
            <TextWithVoice>{currentQuestion.question}</TextWithVoice>
          </p>
        </div>

        {/* Options with Canadian styling */}
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
              className={`p-6 text-xl h-auto transition-all duration-300 ${
                selectedAnswer === option && feedback === "correct"
                  ? "bg-green-500 hover:bg-green-600 border-green-600"
                  : selectedAnswer === option && feedback === "incorrect"
                  ? "bg-red-500 hover:bg-red-600 border-red-600"
                  : "hover:bg-red-50 hover:border-red-300"
              }`}
              size="lg"
            >
              <TextWithVoice>{option}</TextWithVoice>
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2 bg-green-50 p-4 rounded-xl border-2 border-green-200">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct! Great Canadian knowledge!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2 bg-red-50 p-4 rounded-xl border-2 border-red-200">
            <X className="w-6 h-6" />
            <TextWithVoice>The answer is {currentQuestion.correct}</TextWithVoice>
          </div>
        )}

        {/* Stage Progress with Canadian theme */}
        <div className="mt-6 pt-6 border-t border-red-100">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Journey Across Canada</TextWithVoice>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(QUESTIONS_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-full transition-all duration-300 ${
                  i < questionsInStage ? 'bg-red-600 shadow-sm' : 'bg-gray-200'
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