import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Trophy } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";
import keyboardChart from "figma:asset/69a6045374e8983417bb1989bfff90d49bdf3e37.png";

interface TypingTestProps {
  onBack: () => void;
}

// Sentences organized by level
const sentencesByLevel: Record<number, string[]> = {
  1: [
    "I can run fast.",
    "The cat sat on the mat.",
    "I like to play.",
    "The sun is hot.",
    "Dogs are fun.",
  ],
  2: [
    "I like to read books.",
    "The bird flew away.",
    "My bike is red and blue.",
    "We went to the park.",
    "Summer is my favorite season.",
  ],
  3: [
    "The quick brown fox jumps over the lazy dog.",
    "I enjoy playing hockey with my friends.",
    "Canada has many beautiful lakes and mountains.",
    "Reading helps us learn new things.",
    "Math is fun when you practice every day.",
  ],
  4: [
    "The beaver is Canada's national animal.",
    "Education is important for everyone.",
    "I like to explore nature and discover new things.",
    "Science helps us understand the world around us.",
    "Working together makes everything easier.",
  ],
  5: [
    "Reading is to the mind what exercise is to the body.",
    "Mathematics is the language in which the universe is written.",
    "Education is the most powerful tool for changing the world.",
    "Science and technology help solve important problems.",
    "Creative thinking leads to amazing discoveries and inventions.",
  ],
  6: [
    "Canadian geography includes mountains, prairies, and coastal regions.",
    "Effective communication requires both listening and speaking skills.",
    "Environmental conservation is essential for future generations.",
    "Technology has transformed the way we learn and communicate.",
    "Critical thinking helps us make informed decisions every day.",
  ],
  7: [
    "Understanding different perspectives enriches our worldview significantly.",
    "Scientific research requires careful observation and systematic analysis.",
    "Mathematical concepts apply to numerous real-world situations daily.",
    "Historical events shape our present society and future possibilities.",
    "Collaboration and teamwork produce better results than working alone.",
  ],
  8: [
    "Technological advancement has revolutionized modern society in countless ways.",
    "Critical analysis and evaluation are essential skills for academic success.",
    "Environmental sustainability requires collective action and individual responsibility.",
    "Mathematical reasoning develops logical thinking and problem-solving abilities.",
    "Effective written communication demands clarity, coherence, and proper grammar.",
  ],
  9: [
    "Comprehensive understanding requires synthesizing information from multiple sources.",
    "Philosophical inquiry encourages contemplation of fundamental questions about existence.",
    "Scientific methodology emphasizes empirical evidence and reproducible experimental results.",
    "Literary analysis involves examining themes, symbolism, and narrative structure carefully.",
    "Ethical considerations influence decision-making processes in professional contexts.",
  ],
  10: [
    "Interdisciplinary approaches facilitate comprehensive understanding of complex phenomena.",
    "Epistemological frameworks determine how we acquire and validate knowledge systematically.",
    "Contemporary societal challenges require innovative solutions and collaborative international efforts.",
    "Metacognitive awareness enhances learning efficiency and academic performance substantially.",
    "Technological integration in education necessitates continuous professional development and adaptation.",
  ],
};

export function TypingTest({ onBack }: TypingTestProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "typing";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [sentence, setSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [typingAccuracy, setTypingAccuracy] = useState(100);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [sentencesInStage, setSentencesInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const SENTENCES_PER_STAGE = 5; // 5 sentences = 1 stage

  // Get sentences for current level
  const currentLevelSentences = sentencesByLevel[currentLevel] || sentencesByLevel[1];

  useEffect(() => {
    loadNewSentence();
  }, [currentLevel]);

  const loadNewSentence = () => {
    const randomSentence = currentLevelSentences[Math.floor(Math.random() * currentLevelSentences.length)];
    setSentence(randomSentence);
    speak(randomSentence);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === sentence[i]) {
        correct++;
      }
    }
    const currentAccuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    setTypingAccuracy(currentAccuracy);

    // Check if complete
    if (value === sentence) {
      const end = Date.now();
      
      // Calculate WPM
      const timeInMinutes = (end - (startTime || end)) / 60000;
      const words = sentence.split(" ").length;
      const calculatedWpm = Math.round(words / timeInMinutes);
      setWpm(calculatedWpm);
      
      // Determine if correct (require 90%+ accuracy)
      const isCorrect = currentAccuracy >= 90;
      
      if (isCorrect) {
        setStageCorrect(stageCorrect + 1);
        recordAnswer(true, 'literacy');
        speak("Great job!");
      } else {
        recordAnswer(false, 'literacy');
        speak("Try to be more accurate next time.");
      }

      setStageTotal(stageTotal + 1);
      setSentencesInStage(sentencesInStage + 1);
      
      // Show brief success message
      setShowSuccess(true);
      
      // Check if stage completed
      if (sentencesInStage + 1 >= SENTENCES_PER_STAGE) {
        setTimeout(() => {
          completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
        }, 1500);
      } else {
        setTimeout(() => {
          loadNewSentence();
          setUserInput("");
          setStartTime(null);
          setTypingAccuracy(100);
          setShowSuccess(false);
        }, 1500);
      }
    }
  };

  const completeStage = async (correct: number, total: number) => {
    // Record stage completion
    await recordStageCompletion(gameId, correct, total);

    // Reset stage counters
    setStageCorrect(0);
    setStageTotal(0);
    setSentencesInStage(0);

    // Check if can level up
    if (canLevelUp(gameId)) {
      setShowLevelUp(true);
    } else {
      loadNewSentence();
      setUserInput("");
      setStartTime(null);
      setTypingAccuracy(100);
      setShowSuccess(false);
    }
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUp(false);
    loadNewSentence();
    setUserInput("");
    setStartTime(null);
    setTypingAccuracy(100);
    setShowSuccess(false);
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

      <Card className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl mb-2">
            <TextWithVoice>⌨️ Typing on the Tundra - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            <TextWithVoice>Sentence {sentencesInStage + 1} of {SENTENCES_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Sentence to Type */}
        <div className="bg-gray-100 p-4 md:p-6 rounded-lg mb-6">
          <p className="text-lg md:text-2xl text-center text-gray-700 leading-relaxed">
            <TextWithVoice>{sentence}</TextWithVoice>
          </p>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          className="w-full p-4 text-lg md:text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4"
          autoFocus
          disabled={showSuccess}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">
              <TextWithVoice>Speed</TextWithVoice>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              <TextWithVoice>{wpm} WPM</TextWithVoice>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">
              <TextWithVoice>Precision</TextWithVoice>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              <TextWithVoice>{typingAccuracy}%</TextWithVoice>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Trophy className="w-6 h-6" />
              <span className="text-xl font-semibold">
                <TextWithVoice>Complete! {wpm} WPM • {typingAccuracy}%</TextWithVoice>
              </span>
            </div>
          </div>
        )}

        {/* Keyboard Reference */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-center text-sm text-gray-600 mb-3">
            <TextWithVoice>Keyboard Reference</TextWithVoice>
          </h3>
          <ImageWithFallback
            src={keyboardChart}
            alt="Keyboard Chart"
            className="w-full max-w-2xl mx-auto rounded-lg"
          />
        </div>

        {/* Stage Progress Indicator */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Stage Progress</TextWithVoice>
          </div>
          <div className="flex gap-2 justify-center">
            {[...Array(SENTENCES_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
                  i < sentencesInStage
                    ? 'bg-green-600'
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