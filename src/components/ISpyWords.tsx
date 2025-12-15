import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, Search } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface ISpyWordsProps {
  onBack: () => void;
}

interface WordChallenge {
  target: string;
  words: string[];
  correctWords: string[];
}

// Word challenges by level - finding root words in compound/related words
const challengesByLevel: Record<number, WordChallenge[]> = {
  1: [
    { target: "cat", words: ["cats", "dog", "catch", "bird"], correctWords: ["cats", "catch"] },
    { target: "sun", words: ["moon", "sunny", "star", "sunset"], correctWords: ["sunny", "sunset"] },
    { target: "run", words: ["running", "walk", "runner", "jump"], correctWords: ["running", "runner"] },
  ],
  2: [
    { target: "play", words: ["playing", "work", "player", "sleep"], correctWords: ["playing", "player"] },
    { target: "book", words: ["books", "read", "bookmark", "write"], correctWords: ["books", "bookmark"] },
    { target: "rain", words: ["rainy", "snow", "rainbow", "cloud"], correctWords: ["rainy", "rainbow"] },
  ],
  3: [
    { target: "light", words: ["sunlight", "dark", "lighter", "shadow"], correctWords: ["sunlight", "lighter"] },
    { target: "snow", words: ["snowy", "rain", "snowman", "ice"], correctWords: ["snowy", "snowman"] },
    { target: "hand", words: ["handle", "foot", "handful", "arm"], correctWords: ["handle", "handful"] },
  ],
  4: [
    { target: "star", words: ["starfish", "moon", "starlight", "planet"], correctWords: ["starfish", "starlight"] },
    { target: "fire", words: ["firefly", "water", "firework", "smoke"], correctWords: ["firefly", "firework"] },
    { target: "wind", words: ["windy", "calm", "windmill", "breeze"], correctWords: ["windy", "windmill"] },
  ],
  5: [
    { target: "water", words: ["waterfall", "land", "underwater", "desert"], correctWords: ["waterfall", "underwater"] },
    { target: "foot", words: ["footprint", "hand", "football", "finger"], correctWords: ["footprint", "football"] },
    { target: "time", words: ["timeline", "space", "timer", "distance"], correctWords: ["timeline", "timer"] },
  ],
  6: [
    { target: "look", words: ["onlooker", "listen", "overlook", "hear"], correctWords: ["onlooker", "overlook"] },
    { target: "work", words: ["artwork", "play", "homework", "leisure"], correctWords: ["artwork", "homework"] },
    { target: "some", words: ["someone", "nobody", "something", "nothing"], correctWords: ["someone", "something"] },
  ],
  7: [
    { target: "under", words: ["understand", "over", "underground", "above"], correctWords: ["understand", "underground"] },
    { target: "over", words: ["overcome", "under", "overlook", "below"], correctWords: ["overcome", "overlook"] },
    { target: "out", words: ["outside", "inside", "outlook", "within"], correctWords: ["outside", "outlook"] },
  ],
  8: [
    { target: "mind", words: ["mindful", "body", "reminder", "soul"], correctWords: ["mindful", "reminder"] },
    { target: "wonder", words: ["wonderful", "ordinary", "wondering", "common"], correctWords: ["wonderful", "wondering"] },
    { target: "power", words: ["powerful", "weak", "empower", "feeble"], correctWords: ["powerful", "empower"] },
  ],
  9: [
    { target: "stand", words: ["understand", "sit", "outstanding", "rest"], correctWords: ["understand", "outstanding"] },
    { target: "form", words: ["transform", "break", "uniform", "destroy"], correctWords: ["transform", "uniform"] },
    { target: "port", words: ["transport", "carry", "portable", "move"], correctWords: ["transport", "portable"] },
  ],
  10: [
    { target: "graph", words: ["photograph", "image", "biography", "story"], correctWords: ["photograph", "biography"] },
    { target: "scope", words: ["telescope", "lens", "microscope", "glass"], correctWords: ["telescope", "microscope"] },
    { target: "struct", words: ["structure", "chaos", "construct", "disorder"], correctWords: ["structure", "construct"] },
  ],
};

export function ISpyWords({ onBack }: ISpyWordsProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "ispy";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const QUESTIONS_PER_STAGE = 8;

  const generateChallenge = () => {
    const levelChallenges = challengesByLevel[currentLevel] || challengesByLevel[1];
    const randomChallenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
    
    setCurrentChallenge(randomChallenge);
    setFoundWords(new Set());
    setHoveredWord(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateChallenge();
  }, [currentLevel]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMagnifierPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current && e.touches.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setMagnifierPos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  };

  const handleWordClick = (word: string) => {
    if (!currentChallenge || foundWords.has(word)) return;

    const isCorrect = currentChallenge.correctWords.includes(word);
    
    if (isCorrect) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(word);
      setFoundWords(newFoundWords);
      setFeedback("correct");
      speak("Correct! You found it!");

      // Check if all correct words are found
      if (newFoundWords.size === currentChallenge.correctWords.length) {
        setStageCorrect(stageCorrect + 1);
        recordAnswer(true, 'literacy');
        setStageTotal(stageTotal + 1);
        setQuestionsInStage(questionsInStage + 1);

        setTimeout(() => {
          if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
            completeStage(stageCorrect + 1, stageTotal + 1);
          } else {
            generateChallenge();
          }
        }, 1500);
      } else {
        setTimeout(() => setFeedback(null), 800);
      }
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. That word doesn't contain ${currentChallenge.target}`);
      
      setTimeout(() => setFeedback(null), 1500);
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

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  const allWordsFound = foundWords.size === currentChallenge.correctWords.length;

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
            <TextWithVoice>I Spy Words - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Target Word with Magnifying Glass */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <h3 className="text-2xl font-semibold">
              <TextWithVoice>I SPY</TextWithVoice>
            </h3>
            <div className="relative inline-flex items-center justify-center">
              <div className="border-4 border-gray-800 rounded-full w-24 h-24 flex items-center justify-center bg-white shadow-lg">
                <span className="text-2xl font-bold text-red-600">
                  <TextWithVoice>{currentChallenge.target}</TextWithVoice>
                </span>
              </div>
              <div className="absolute -bottom-4 -right-2 w-3 h-12 bg-gray-800 rounded-full transform rotate-45"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <TextWithVoice>Drag the magnifying glass to find words containing "{currentChallenge.target}"</TextWithVoice>
          </p>
        </div>

        {/* Interactive Word Grid */}
        <div
          ref={containerRef}
          className="relative bg-gray-50 rounded-lg p-8 min-h-[300px] cursor-none select-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => setIsDragging(true)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          <div className="grid grid-cols-2 gap-6">
            {currentChallenge.words.map((word, index) => {
              const isFound = foundWords.has(word);
              const isCorrectWord = currentChallenge.correctWords.includes(word);
              
              return (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  onMouseEnter={() => setHoveredWord(word)}
                  onMouseLeave={() => setHoveredWord(null)}
                  disabled={isFound}
                  className={`p-6 text-2xl rounded-lg transition-all border-2 ${
                    isFound
                      ? "bg-green-100 border-green-500 text-green-700"
                      : hoveredWord === word && isDragging && isCorrectWord
                      ? "bg-yellow-100 border-yellow-500 scale-105"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <TextWithVoice>{word}</TextWithVoice>
                </button>
              );
            })}
          </div>

          {/* Floating Magnifying Glass */}
          {isDragging && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: magnifierPos.x - 40,
                top: magnifierPos.y - 40,
              }}
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-800 rounded-full bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <div className="absolute -bottom-3 -right-2 w-2.5 h-10 bg-gray-800 rounded-full transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback === "correct" && !allWordsFound && (
          <div className="text-green-600 text-xl mt-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct! Keep looking for more!</TextWithVoice>
          </div>
        )}

        {allWordsFound && (
          <div className="text-green-600 text-xl mt-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Excellent! You found all the words!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mt-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Try again! That word doesn't contain "{currentChallenge.target}"</TextWithVoice>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <TextWithVoice>
            Found {foundWords.size} of {currentChallenge.correctWords.length} words
          </TextWithVoice>
        </div>

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
                  i < questionsInStage ? 'bg-red-600' : 'bg-gray-200'
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
