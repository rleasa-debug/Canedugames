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

interface VowelSoundsSortingProps {
  onBack: () => void;
}

interface WordChallenge {
  vowel: string;
  shortSound: string;
  longSound: string;
  shortExample: string;
  longExample: string;
  words: string[];
  correctShort: string[];
  correctLong: string[];
}

// Word challenges by level
const challengesByLevel: Record<number, WordChallenge[]> = {
  1: [
    {
      vowel: "a",
      shortSound: "as in at",
      longSound: "as in ate",
      shortExample: "cat",
      longExample: "cake",
      words: ["across", "lady", "slap", "glaze", "trap", "after", "paste", "trade"],
      correctShort: ["across", "slap", "trap", "after"],
      correctLong: ["lady", "glaze", "paste", "trade"]
    },
    {
      vowel: "a",
      shortSound: "as in at",
      longSound: "as in ate",
      shortExample: "cat",
      longExample: "cake",
      words: ["map", "rake", "cap", "save", "snap", "brave", "black", "shake"],
      correctShort: ["map", "cap", "snap", "black"],
      correctLong: ["rake", "save", "brave", "shake"]
    }
  ],
  2: [
    {
      vowel: "e",
      shortSound: "as in bed",
      longSound: "as in see",
      shortExample: "pet",
      longExample: "bee",
      words: ["red", "tree", "next", "keep", "test", "sleep", "held", "seed"],
      correctShort: ["red", "next", "test", "held"],
      correctLong: ["tree", "keep", "sleep", "seed"]
    },
    {
      vowel: "e",
      shortSound: "as in bed",
      longSound: "as in see",
      shortExample: "pet",
      longExample: "bee",
      words: ["shed", "feet", "melt", "need", "neck", "green", "tent", "fleet"],
      correctShort: ["shed", "melt", "neck", "tent"],
      correctLong: ["feet", "need", "green", "fleet"]
    }
  ],
  3: [
    {
      vowel: "i",
      shortSound: "as in it",
      longSound: "as in ice",
      shortExample: "sit",
      longExample: "kite",
      words: ["skip", "pride", "clip", "drive", "swim", "shine", "brick", "glide"],
      correctShort: ["skip", "clip", "swim", "brick"],
      correctLong: ["pride", "drive", "shine", "glide"]
    },
    {
      vowel: "i",
      shortSound: "as in it",
      longSound: "as in ice",
      shortExample: "sit",
      longExample: "kite",
      words: ["slip", "tribe", "trim", "strike", "flint", "bike", "grill", "pride"],
      correctShort: ["slip", "trim", "flint", "grill"],
      correctLong: ["tribe", "strike", "bike", "pride"]
    }
  ],
  4: [
    {
      vowel: "o",
      shortSound: "as in hot",
      longSound: "as in hope",
      shortExample: "pot",
      longExample: "rope",
      words: ["stop", "froze", "block", "phone", "shock", "slope", "cost", "smoke"],
      correctShort: ["stop", "block", "shock", "cost"],
      correctLong: ["froze", "phone", "slope", "smoke"]
    },
    {
      vowel: "o",
      shortSound: "as in hot",
      longSound: "as in hope",
      shortExample: "pot",
      longExample: "rope",
      words: ["clock", "stone", "drop", "globe", "crop", "broke", "fond", "stove"],
      correctShort: ["clock", "drop", "crop", "fond"],
      correctLong: ["stone", "globe", "broke", "stove"]
    }
  ],
  5: [
    {
      vowel: "u",
      shortSound: "as in cup",
      longSound: "as in cute",
      shortExample: "bug",
      longExample: "mule",
      words: ["trunk", "flute", "brush", "cube", "lunch", "tube", "stump", "prune"],
      correctShort: ["trunk", "brush", "lunch", "stump"],
      correctLong: ["flute", "cube", "tube", "prune"]
    },
    {
      vowel: "u",
      shortSound: "as in cup",
      longSound: "as in cute",
      shortExample: "bug",
      longExample: "mule",
      words: ["crumb", "duke", "blunt", "fume", "stunt", "flute", "grump", "tune"],
      correctShort: ["crumb", "blunt", "stunt", "grump"],
      correctLong: ["duke", "fume", "flute", "tune"]
    }
  ],
  6: [
    {
      vowel: "a & e",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed",
      longExample: "cake, see",
      words: ["trap", "sweep", "fast", "green", "melt", "shade", "nest", "plate"],
      correctShort: ["trap", "fast", "melt", "nest"],
      correctLong: ["sweep", "green", "shade", "plate"]
    },
    {
      vowel: "a & e",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed",
      longExample: "cake, see",
      words: ["meet", "stamp", "wheat", "crash", "sleep", "snack", "bleed", "track"],
      correctShort: ["stamp", "crash", "snack", "track"],
      correctLong: ["meet", "wheat", "sleep", "bleed"]
    }
  ],
  7: [
    {
      vowel: "i & o",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "sit, pot",
      longExample: "ice, rope",
      words: ["skip", "broke", "swift", "stone", "shift", "slope", "plot", "drive"],
      correctShort: ["skip", "swift", "shift", "plot"],
      correctLong: ["broke", "stone", "slope", "drive"]
    },
    {
      vowel: "i & o",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "sit, pot",
      longExample: "ice, rope",
      words: ["throne", "flinch", "smoke", "swift", "choke", "brick", "block", "strike"],
      correctShort: ["flinch", "swift", "brick", "block"],
      correctLong: ["throne", "smoke", "choke", "strike"]
    }
  ],
  8: [
    {
      vowel: "a, e & i",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed, sit",
      longExample: "cake, see, ice",
      words: ["snap", "sweet", "pride", "melt", "flame", "shrimp", "bleed", "flap"],
      correctShort: ["snap", "melt", "shrimp", "flap"],
      correctLong: ["sweet", "pride", "flame", "bleed"]
    },
    {
      vowel: "a, e & i",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed, sit",
      longExample: "cake, see, ice",
      words: ["tribe", "chest", "frame", "fleet", "clinic", "brave", "swift", "wheat"],
      correctShort: ["chest", "clinic", "swift"],
      correctLong: ["tribe", "frame", "fleet", "brave", "wheat"]
    }
  ],
  9: [
    {
      vowel: "o & u",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "pot, cup",
      longExample: "rope, cute",
      words: ["slump", "phone", "brush", "globe", "trunk", "flute", "shock", "slope"],
      correctShort: ["slump", "brush", "trunk", "shock"],
      correctLong: ["phone", "globe", "flute", "slope"]
    },
    {
      vowel: "o & u",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "pot, cup",
      longExample: "rope, cute",
      words: ["grump", "stone", "blunt", "prune", "block", "duke", "plump", "throne"],
      correctShort: ["grump", "blunt", "block", "plump"],
      correctLong: ["stone", "prune", "duke", "throne"]
    }
  ],
  10: [
    {
      vowel: "all vowels",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed, sit, pot, cup",
      longExample: "cake, see, ice, rope, cute",
      words: ["trap", "sweet", "pride", "stump", "phone", "snap", "tribe", "globe"],
      correctShort: ["trap", "stump", "snap"],
      correctLong: ["sweet", "pride", "phone", "tribe", "globe"]
    },
    {
      vowel: "all vowels",
      shortSound: "short vowel",
      longSound: "long vowel",
      shortExample: "cat, bed, sit, pot, cup",
      longExample: "cake, see, ice, rope, cute",
      words: ["chest", "flute", "broke", "swift", "trade", "blunt", "green", "shock"],
      correctShort: ["chest", "swift", "blunt", "shock"],
      correctLong: ["flute", "broke", "trade", "green"]
    }
  ],
};

export function VowelSoundsSorting({ onBack }: VowelSoundsSortingProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "vowelsounds";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [shortColumn, setShortColumn] = useState<string[]>([]);
  const [longColumn, setLongColumn] = useState<string[]>([]);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  const QUESTIONS_PER_STAGE = 8;

  const generateChallenge = () => {
    const levelChallenges = challengesByLevel[currentLevel] || challengesByLevel[1];
    const randomChallenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
    
    // Shuffle words
    const shuffled = [...randomChallenge.words].sort(() => Math.random() - 0.5);
    
    setCurrentChallenge(randomChallenge);
    setAvailableWords(shuffled);
    setShortColumn([]);
    setLongColumn([]);
    setFeedback(null);
    setCompletedWords(new Set());
  };

  useEffect(() => {
    generateChallenge();
  }, [currentLevel]);

  const handleDragStart = (word: string) => {
    setDraggedWord(word);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnShort = () => {
    if (!draggedWord || !currentChallenge) return;
    
    // Move word from available to short column
    setAvailableWords(prev => prev.filter(w => w !== draggedWord));
    setShortColumn(prev => [...prev, draggedWord]);
    setDraggedWord(null);
  };

  const handleDropOnLong = () => {
    if (!draggedWord || !currentChallenge) return;
    
    // Move word from available to long column
    setAvailableWords(prev => prev.filter(w => w !== draggedWord));
    setLongColumn(prev => [...prev, draggedWord]);
    setDraggedWord(null);
  };

  const handleWordClick = (word: string, column: "short" | "long") => {
    // Return word to available pool
    if (column === "short") {
      setShortColumn(prev => prev.filter(w => w !== word));
    } else {
      setLongColumn(prev => prev.filter(w => w !== word));
    }
    setAvailableWords(prev => [...prev, word]);
  };

  const handleSubmit = () => {
    if (!currentChallenge) return;
    
    // Check if all words are placed
    if (availableWords.length > 0) {
      speak("Please sort all the words first!");
      return;
    }

    // Check correctness
    const shortCorrect = shortColumn.every(word => currentChallenge.correctShort.includes(word));
    const longCorrect = longColumn.every(word => currentChallenge.correctLong.includes(word));
    const allCorrect = shortCorrect && longCorrect;

    if (allCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Excellent! You sorted all the vowel sounds correctly!");
      
      setStageTotal(stageTotal + 1);
      setQuestionsInStage(questionsInStage + 1);

      setTimeout(() => {
        if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
          completeStage(stageCorrect + 1, stageTotal + 1);
        } else {
          generateChallenge();
        }
      }, 2000);
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      setStageTotal(stageTotal + 1);
      setQuestionsInStage(questionsInStage + 1);
      speak("Not quite right. Try listening to the vowel sounds again.");
      
      setTimeout(() => {
        if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
          completeStage(stageCorrect, stageTotal + 1);
        } else {
          generateChallenge();
        }
      }, 2000);
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
      generateChallenge();
    }
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    generateChallenge();
  };

  const speakWord = (word: string) => {
    speak(word);
  };

  if (!currentChallenge) {
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
            <TextWithVoice>Vowel Sounds Sorting - Level {currentLevel}</TextWithVoice>
          </h2>
        </div>

        {/* Instructions */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 px-4 py-2 rounded-lg">
            <div className="text-4xl">
              <TextWithVoice>{currentChallenge.vowel}</TextWithVoice>
            </div>
            <div className="text-sm text-gray-700">
              <TextWithVoice>Drag each word to the correct sound</TextWithVoice>
            </div>
          </div>
        </div>

        {/* Sorting Table - More Compact */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Short Vowel Column */}
          <div className="border-2 border-blue-400 rounded-lg bg-blue-50">
            <div className="bg-blue-600 text-white p-2 rounded-t-lg">
              <h3 className="font-semibold text-center text-sm mb-1">
                <TextWithVoice>Vowel Sound</TextWithVoice>
              </h3>
              <p className="text-xs text-center">
                <TextWithVoice>{currentChallenge.vowel} ({currentChallenge.shortSound})</TextWithVoice>
              </p>
              <p className="text-xs text-center opacity-90">
                <TextWithVoice>Ex: {currentChallenge.shortExample}</TextWithVoice>
              </p>
            </div>
            <div
              className="min-h-[240px] p-3"
              onDragOver={handleDragOver}
              onDrop={handleDropOnShort}
            >
              {shortColumn.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word, "short")}
                  className="bg-white border-2 border-blue-300 rounded-lg p-2 mb-2 cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-base"><TextWithVoice>{word}</TextWithVoice></span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(word);
                    }}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Long Vowel Column */}
          <div className="border-2 border-green-400 rounded-lg bg-green-50">
            <div className="bg-green-600 text-white p-2 rounded-t-lg">
              <h3 className="font-semibold text-center text-sm mb-1">
                <TextWithVoice>Vowel Name</TextWithVoice>
              </h3>
              <p className="text-xs text-center">
                <TextWithVoice>{currentChallenge.vowel} ({currentChallenge.longSound})</TextWithVoice>
              </p>
              <p className="text-xs text-center opacity-90">
                <TextWithVoice>Ex: {currentChallenge.longExample}</TextWithVoice>
              </p>
            </div>
            <div
              className="min-h-[240px] p-3"
              onDragOver={handleDragOver}
              onDrop={handleDropOnLong}
            >
              {longColumn.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word, "long")}
                  className="bg-white border-2 border-green-300 rounded-lg p-2 mb-2 cursor-pointer hover:bg-green-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-base"><TextWithVoice>{word}</TextWithVoice></span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(word);
                    }}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Words - More Compact */}
        <div className="mb-4">
          <h4 className="text-sm mb-2 text-center font-semibold">
            <TextWithVoice>Drag these words to sort them:</TextWithVoice>
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableWords.map((word, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(word)}
                className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-3 py-2 cursor-move hover:bg-yellow-200 transition-colors shadow-md flex items-center gap-2"
              >
                <span className="text-base font-semibold"><TextWithVoice>{word}</TextWithVoice></span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(word);
                  }}
                  className="p-0 h-auto"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {availableWords.length === 0 && feedback === null && (
          <div className="text-center mb-3">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Check My Answers
            </Button>
          </div>
        )}

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-base mb-3 flex items-center justify-center gap-2 bg-green-50 p-3 rounded-lg">
            <Check className="w-5 h-5" />
            <TextWithVoice>Excellent! Perfect sorting!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-base mb-3 flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg">
            <X className="w-5 h-5" />
            <TextWithVoice>Not quite right. Listen carefully to the vowel sounds.</TextWithVoice>
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
                  i < questionsInStage ? 'bg-purple-600' : 'bg-gray-200'
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