import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Volume2, Check, X, ArrowRight } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface SpellingBeeProps {
  onBack: () => void;
}

// Words organized by level (Canadian curriculum aligned)
const wordsByLevel: Record<number, string[]> = {
  1: ["cat", "dog", "sun", "run", "bat", "hat", "map", "hop", "sit", "top", "bug", "log", "dig", "pen", "bed", "wet", "red", "cup", "rug", "fox"],
  2: ["fish", "moon", "tree", "bike", "make", "take", "home", "jump", "star", "play", "came", "like", "blue", "time", "look", "were", "snow", "they", "went", "what"],
  3: ["happy", "study", "train", "plant", "smile", "story", "apple", "friend", "snake", "price", "truck", "brown", "phone", "world", "place", "think", "right", "great", "space", "brave"],
  4: ["school", "quickly", "finally", "number", "season", "people", "family", "garden", "answer", "winter", "summer", "spring", "through", "different", "special", "country", "because", "example", "picture", "strange"],
  5: ["adventure", "beautiful", "important", "celebrate", "discovery", "furniture", "knowledge", "necessary", "rectangle", "strength", "technology", "understand", "volunteer", "beginning", "committee", "different", "equipment", "favorite", "government", "interesting"],
  6: ["achievement", "atmosphere", "commercial", "contribute", "definition", "electronic", "experience", "foundation", "generation", "independent", "laboratory", "magnificent", "opportunity", "parliament", "qualification", "restaurant", "scholarship", "temperature", "vaccination", "appreciate"],
  7: ["accommodation", "apologize", "approximately", "characteristic", "collaboration", "communication", "consequences", "demonstration", "encyclopedia", "entertainment", "extraordinary", "infrastructure", "internationally", "investigation", "manufacturer", "Mediterranean", "multiplication", "observational", "pharmaceutical", "psychological"],
  8: ["accelerate", "acknowledge", "adolescent", "autobiography", "bureaucracy", "conscientious", "contemporary", "deteriorate", "embarrassment", "extracurricular", "fluorescent", "governmental", "hypothetical", "incidentally", "irresponsible", "Mediterranean", "miscellaneous", "occasionally", "parliamentary", "questionnaire"],
  9: ["accommodation", "accessible", "accumulate", "achievement", "acknowledge", "acquaintance", "adequate", "affectionate", "aggressive", "ambiguous", "amateur", "amendment", "analysis", "anticipate", "appropriate", "approximate", "archaeology", "arrangement", "assessment", "asthma"],
  10: ["abbreviation", "abhorrent", "abstemious", "abstinence", "accelerator", "accessibility", "acclimatize", "accomplish", "accumulation", "acknowledgment", "acquiescence", "acquisition", "admissible", "advantageous", "affiliation", "aggravate", "allegiance", "alliteration", "alphabetical", "anachronism"]
};

export function SpellingBee({ onBack }: SpellingBeeProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "spelling";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [wordsInStage, setWordsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const WORDS_PER_STAGE = 10; // 10 words = 1 stage
  const currentLevelWords = wordsByLevel[currentLevel] || wordsByLevel[1];
  const currentWord = currentLevelWords[currentWordIndex];

  // Shuffle words when level changes
  useEffect(() => {
    setCurrentWordIndex(0);
    setUserInput("");
    setFeedback(null);
  }, [currentLevel]);

  const checkSpelling = () => {
    const isCorrect = userInput.toLowerCase().trim() === currentWord.toLowerCase();

    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Correct! Well done!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. The correct spelling is ${currentWord}`);
    }

    setStageTotal(stageTotal + 1);
    setWordsInStage(wordsInStage + 1);

    // Check if stage completed
    if (wordsInStage + 1 >= WORDS_PER_STAGE) {
      completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
    }
  };

  const completeStage = async (correct: number, total: number) => {
    // Record stage completion
    await recordStageCompletion(gameId, correct, total);

    // Reset stage counters
    setStageCorrect(0);
    setStageTotal(0);
    setWordsInStage(0);

    // Check if can level up
    if (canLevelUp(gameId)) {
      setShowLevelUp(true);
    }
  };

  const nextWord = () => {
    const nextIndex = (currentWordIndex + 1) % currentLevelWords.length;
    setCurrentWordIndex(nextIndex);
    setUserInput("");
    setFeedback(null);
  };

  const skip = () => {
    recordAnswer(false, 'literacy');
    setStageTotal(stageTotal + 1);
    setWordsInStage(wordsInStage + 1);

    // Check if stage completed
    if (wordsInStage + 1 >= WORDS_PER_STAGE) {
      completeStage(stageCorrect, stageTotal + 1);
    }

    nextWord();
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    setCurrentWordIndex(0);
    setUserInput("");
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>

      {/* Level Display */}
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
            <TextWithVoice>🐝 Spelling Bee - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Word {wordsInStage + 1} of {WORDS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        <div className="text-center mb-6">
          <Button 
            onClick={() => speak(currentWord)} 
            className="mb-6 bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            <TextWithVoice>Hear the Word</TextWithVoice>
          </Button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && userInput && feedback === null && checkSpelling()}
            placeholder="Type the word here..."
            className="w-full p-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            autoFocus
            disabled={feedback !== null}
          />
        </div>

        {feedback === "correct" && (
          <div className="text-green-600 text-xl mb-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Correct! Well done!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Incorrect. The correct spelling is: {currentWord}</TextWithVoice>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={checkSpelling} 
            disabled={!userInput || feedback !== null}
            className="flex-1"
            size="lg"
          >
            <TextWithVoice>Check Spelling</TextWithVoice>
          </Button>
          <Button 
            onClick={skip} 
            variant="outline"
            disabled={feedback !== null}
            size="lg"
          >
            <TextWithVoice>Skip</TextWithVoice>
          </Button>
        </div>

        {feedback !== null && (
          <Button 
            onClick={nextWord} 
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <TextWithVoice>Next Word</TextWithVoice>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {/* Stage Progress Indicator */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Stage Progress</TextWithVoice>
          </div>
          <div className="flex gap-1 justify-center">
            {[...Array(WORDS_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-full ${
                  i < wordsInStage
                    ? 'bg-purple-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Level Up Modal */}
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