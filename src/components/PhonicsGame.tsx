import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Volume2, Check, X } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface PhonicsGameProps {
  onBack: () => void;
}

// Phonics content organized by complexity level
const phonicsByLevel: Record<number, Array<{ sound: string, words: string[], emoji: string }>> = {
  1: [ // Simple beginning sounds
    { sound: "A", words: ["Apple", "Ant"], emoji: "🍎" },
    { sound: "B", words: ["Ball", "Bear"], emoji: "⚽" },
    { sound: "C", words: ["Cat", "Car"], emoji: "🐱" },
    { sound: "D", words: ["Dog", "Duck"], emoji: "🐕" },
  ],
  2: [ // More beginning sounds
    { sound: "E", words: ["Egg", "Eagle"], emoji: "🥚" },
    { sound: "F", words: ["Fish", "Frog"], emoji: "🐟" },
    { sound: "G", words: ["Goat", "Grapes"], emoji: "🐐" },
    { sound: "H", words: ["House", "Horse"], emoji: "🏠" },
    { sound: "I", words: ["Igloo", "Insect"], emoji: "🍦" },
  ],
  3: [ // All single letter sounds
    { sound: "J", words: ["Juice", "Jump"], emoji: "🧃" },
    { sound: "K", words: ["Kite", "King"], emoji: "🪁" },
    { sound: "L", words: ["Lion", "Leaf"], emoji: "🦁" },
    { sound: "M", words: ["Moon", "Mouse"], emoji: "🌙" },
    { sound: "N", words: ["Nest", "Nose"], emoji: "🥜" },
  ],
  4: [ // More complex single sounds
    { sound: "O", words: ["Orange", "Owl"], emoji: "🍊" },
    { sound: "P", words: ["Pig", "Pizza"], emoji: "🐷" },
    { sound: "Q", words: ["Queen", "Quilt"], emoji: "👑" },
    { sound: "R", words: ["Rainbow", "Rabbit"], emoji: "🌈" },
    { sound: "S", words: ["Sun", "Star"], emoji: "☀️" },
  ],
  5: [ // Final single sounds + blends intro
    { sound: "T", words: ["Tree", "Tiger"], emoji: "🌳" },
    { sound: "U", words: ["Umbrella", "Unicorn"], emoji: "☂️" },
    { sound: "V", words: ["Van", "Violin"], emoji: "🚐" },
    { sound: "W", words: ["Water", "Whale"], emoji: "🐋" },
    { sound: "CH", words: ["Chair", "Cheese"], emoji: "🪑" },
  ],
  6: [ // Consonant blends
    { sound: "SH", words: ["Ship", "Shoe"], emoji: "🚢" },
    { sound: "TH", words: ["Thumb", "Think"], emoji: "👍" },
    { sound: "BR", words: ["Bread", "Brush"], emoji: "🍞" },
    { sound: "CR", words: ["Crab", "Crown"], emoji: "🦀" },
    { sound: "DR", words: ["Dragon", "Drum"], emoji: "🐉" },
  ],
  7: [ // More complex blends
    { sound: "FL", words: ["Flag", "Flower"], emoji: "🏳️" },
    { sound: "GL", words: ["Glass", "Glove"], emoji: "🧤" },
    { sound: "PL", words: ["Plate", "Plant"], emoji: "🌱" },
    { sound: "SL", words: ["Slide", "Sleep"], emoji: "🛝" },
    { sound: "ST", words: ["Star", "Stone"], emoji: "⭐" },
  ],
  8: [ // Triple blends and digraphs
    { sound: "SPR", words: ["Spring", "Sprout"], emoji: "🌸" },
    { sound: "STR", words: ["String", "Street"], emoji: "🛣️" },
    { sound: "SCR", words: ["Screen", "Screw"], emoji: "🖥️" },
    { sound: "WH", words: ["Wheel", "Whale"], emoji: "🎡" },
    { sound: "PH", words: ["Phone", "Photo"], emoji: "📱" },
  ],
  9: [ // Advanced patterns
    { sound: "TION", words: ["Station", "Nation"], emoji: "🚉" },
    { sound: "OUGH", words: ["Dough", "Cough"], emoji: "🍞" },
    { sound: "IGHT", words: ["Light", "Night"], emoji: "💡" },
    { sound: "OULD", words: ["Could", "Would"], emoji: "🤔" },
    { sound: "EIGH", words: ["Eight", "Weight"], emoji: "8️⃣" },
  ],
  10: [ // Most complex patterns
    { sound: "OUGH", words: ["Through", "Thought"], emoji: "🧠" },
    { sound: "IOUS", words: ["Curious", "Serious"], emoji: "🤓" },
    { sound: "CIOUS", words: ["Precious", "Gracious"], emoji: "💎" },
    { sound: "TIOUS", words: ["Cautious", "Ambitious"], emoji: "⚠️" },
    { sound: "EOUS", words: ["Gorgeous", "Courageous"], emoji: "🦁" },
  ],
};

export function PhonicsGame({ onBack }: PhonicsGameProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "phonics";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentPhonic, setCurrentPhonic] = useState<{ sound: string, words: string[], emoji: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateQuestion = () => {
    const levelPhonics = phonicsByLevel[currentLevel] || phonicsByLevel[1];
    const randomPhonic = levelPhonics[Math.floor(Math.random() * levelPhonics.length)];
    const correctWord = randomPhonic.words[Math.floor(Math.random() * randomPhonic.words.length)];

    // Generate wrong options from different sounds
    const wrongWords: string[] = [];
    const usedSounds = new Set([randomPhonic.sound]);
    
    while (wrongWords.length < 3) {
      const randomLevel = Math.max(1, currentLevel - 1 + Math.floor(Math.random() * 3));
      const otherLevelPhonics = phonicsByLevel[randomLevel] || phonicsByLevel[1];
      const otherPhonic = otherLevelPhonics[Math.floor(Math.random() * otherLevelPhonics.length)];
      
      if (!usedSounds.has(otherPhonic.sound)) {
        const wrongWord = otherPhonic.words[Math.floor(Math.random() * otherPhonic.words.length)];
        if (!wrongWords.includes(wrongWord) && wrongWord !== correctWord) {
          wrongWords.push(wrongWord);
          usedSounds.add(otherPhonic.sound);
        }
      }
    }

    const allOptions = [...wrongWords, correctWord].sort(() => Math.random() - 0.5);
    
    setCurrentPhonic({ ...randomPhonic, words: [correctWord] });
    setOptions(allOptions);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const handleAnswer = (answer: string) => {
    if (feedback !== null || !currentPhonic) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentPhonic.words[0];
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Correct!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. The correct answer is ${currentPhonic.words[0]}`);
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

  if (!currentPhonic) {
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
            <TextWithVoice>🔊 Phonics by the Pacific - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Sound Display */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{currentPhonic.emoji}</div>
          <div className="bg-pink-100 inline-block px-8 py-4 rounded-2xl mb-4">
            <div className="text-6xl font-bold text-pink-600">
              <TextWithVoice>{currentPhonic.sound}</TextWithVoice>
            </div>
          </div>
          <Button
            onClick={() => speak(currentPhonic.sound)}
            className="bg-pink-500 hover:bg-pink-600 mt-4"
            size="lg"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            <TextWithVoice>Hear the Sound</TextWithVoice>
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            <TextWithVoice>Which word starts with this sound?</TextWithVoice>
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((option, index) => (
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
            <TextWithVoice>Correct! {currentPhonic.words[0]} starts with {currentPhonic.sound}!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Try again! The answer is {currentPhonic.words[0]}</TextWithVoice>
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
                  i < questionsInStage ? 'bg-pink-600' : 'bg-gray-200'
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