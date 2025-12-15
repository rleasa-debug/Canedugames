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

interface SentenceStarsProps {
  onBack: () => void;
}

// Sentences organized by level complexity
const sentencesByLevel: Record<number, Array<{ words: string[], complete: string }>> = {
  1: [
    { words: ["I", "run", "fast"], complete: "I run fast." },
    { words: ["The", "cat", "sat"], complete: "The cat sat." },
    { words: ["We", "are", "happy"], complete: "We are happy." },
    { words: ["I", "see", "you"], complete: "I see you." },
  ],
  2: [
    { words: ["My", "dog", "is", "big"], complete: "My dog is big." },
    { words: ["I", "like", "to", "play"], complete: "I like to play." },
    { words: ["The", "sun", "is", "hot"], complete: "The sun is hot." },
    { words: ["We", "go", "to", "school"], complete: "We go to school." },
  ],
  3: [
    { words: ["I", "can", "read", "this", "book"], complete: "I can read this book." },
    { words: ["The", "bird", "flew", "away", "fast"], complete: "The bird flew away fast." },
    { words: ["My", "friend", "plays", "with", "me"], complete: "My friend plays with me." },
    { words: ["We", "saw", "a", "big", "tree"], complete: "We saw a big tree." },
  ],
  4: [
    { words: ["Canada", "is", "a", "beautiful", "country"], complete: "Canada is a beautiful country." },
    { words: ["The", "quick", "brown", "fox", "jumps"], complete: "The quick brown fox jumps." },
    { words: ["I", "like", "to", "play", "hockey"], complete: "I like to play hockey." },
    { words: ["We", "live", "near", "the", "lake"], complete: "We live near the lake." },
  ],
  5: [
    { words: ["Reading", "helps", "us", "learn", "new", "things"], complete: "Reading helps us learn new things." },
    { words: ["The", "beaver", "builds", "dams", "in", "rivers"], complete: "The beaver builds dams in rivers." },
    { words: ["Toronto", "is", "a", "very", "big", "city"], complete: "Toronto is a very big city." },
    { words: ["We", "celebrate", "Canada", "Day", "in", "July"], complete: "We celebrate Canada Day in July." },
  ],
  6: [
    { words: ["Mathematics", "is", "the", "language", "of", "the", "universe"], complete: "Mathematics is the language of the universe." },
    { words: ["Canadian", "history", "is", "very", "interesting", "to", "study"], complete: "Canadian history is very interesting to study." },
    { words: ["The", "CN", "Tower", "is", "located", "in", "Toronto"], complete: "The CN Tower is located in Toronto." },
    { words: ["Science", "helps", "us", "understand", "the", "natural", "world"], complete: "Science helps us understand the natural world." },
  ],
  7: [
    { words: ["Education", "is", "the", "most", "powerful", "tool", "for", "change"], complete: "Education is the most powerful tool for change." },
    { words: ["The", "Canadian", "Shield", "covers", "much", "of", "northern", "Ontario"], complete: "The Canadian Shield covers much of northern Ontario." },
    { words: ["Critical", "thinking", "skills", "are", "essential", "for", "learning"], complete: "Critical thinking skills are essential for learning." },
  ],
  8: [
    { words: ["Environmental", "conservation", "is", "important", "for", "future", "generations", "to", "thrive"], complete: "Environmental conservation is important for future generations to thrive." },
    { words: ["Technology", "has", "transformed", "the", "way", "we", "communicate", "and", "learn"], complete: "Technology has transformed the way we communicate and learn." },
    { words: ["Understanding", "different", "perspectives", "enriches", "our", "view", "of", "the", "world"], complete: "Understanding different perspectives enriches our view of the world." },
  ],
  9: [
    { words: ["Comprehensive", "understanding", "requires", "synthesizing", "information", "from", "multiple", "reliable", "sources"], complete: "Comprehensive understanding requires synthesizing information from multiple reliable sources." },
    { words: ["Scientific", "research", "methodology", "emphasizes", "empirical", "evidence", "and", "reproducible", "experimental", "results"], complete: "Scientific research methodology emphasizes empirical evidence and reproducible experimental results." },
  ],
  10: [
    { words: ["Interdisciplinary", "approaches", "facilitate", "comprehensive", "understanding", "of", "complex", "contemporary", "phenomena", "and", "challenges"], complete: "Interdisciplinary approaches facilitate comprehensive understanding of complex contemporary phenomena and challenges." },
    { words: ["Metacognitive", "awareness", "significantly", "enhances", "learning", "efficiency", "and", "academic", "performance", "across", "all", "disciplines"], complete: "Metacognitive awareness significantly enhances learning efficiency and academic performance across all disciplines." },
  ],
};

export function SentenceStars({ onBack }: SentenceStarsProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "sentence";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentSentence, setCurrentSentence] = useState<{ words: string[], complete: string } | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 6;

  const generateQuestion = () => {
    const levelSentences = sentencesByLevel[currentLevel] || sentencesByLevel[1];
    const randomSentence = levelSentences[Math.floor(Math.random() * levelSentences.length)];
    
    const shuffled = [...randomSentence.words].sort(() => Math.random() - 0.5);
    
    setCurrentSentence(randomSentence);
    setShuffledWords(shuffled);
    setBuiltSentence([]);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const addWord = (word: string, index: number) => {
    if (feedback !== null) return;
    
    setBuiltSentence([...builtSentence, word]);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));
  };

  const removeWord = (index: number) => {
    if (feedback !== null) return;
    
    const word = builtSentence[index];
    setBuiltSentence(builtSentence.filter((_, i) => i !== index));
    setShuffledWords([...shuffledWords, word]);
  };

  const checkSentence = () => {
    if (!currentSentence || builtSentence.length === 0) return;

    const userSentence = builtSentence.join(" ") + ".";
    const isCorrect = userSentence === currentSentence.complete;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Perfect sentence!");
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak("Not quite right. Try again!");
    }

    setStageTotal(stageTotal + 1);
    setQuestionsInStage(questionsInStage + 1);

    setTimeout(() => {
      if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
        completeStage(stageCorrect + (isCorrect ? 1 : 0), stageTotal + 1);
      } else {
        generateQuestion();
      }
    }, 2000);
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

  if (!currentSentence) {
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
            <TextWithVoice>⭐ Sentence Building in Saskatchewan - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            <TextWithVoice>Build a sentence by clicking the words in order!</TextWithVoice>
          </p>
        </div>

        {/* Built Sentence Area */}
        <div className="mb-6 p-6 bg-yellow-50 rounded-lg min-h-24 border-2 border-yellow-200">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {builtSentence.length === 0 && (
              <p className="text-gray-400 text-lg">Click words below to build your sentence...</p>
            )}
            {builtSentence.map((word, index) => (
              <Button
                key={index}
                onClick={() => removeWord(index)}
                variant="secondary"
                className="text-lg px-4 py-2"
                disabled={feedback !== null}
              >
                {word}
              </Button>
            ))}
            {builtSentence.length > 0 && <span className="text-2xl">.</span>}
          </div>
        </div>

        {/* Available Words */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center mb-3">
            <TextWithVoice>Available Words:</TextWithVoice>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {shuffledWords.map((word, index) => (
              <Button
                key={index}
                onClick={() => addWord(word, index)}
                variant="outline"
                className="text-lg px-6 py-3"
                disabled={feedback !== null}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        {/* Check Button */}
        <Button
          onClick={checkSentence}
          disabled={builtSentence.length === 0 || feedback !== null}
          className="w-full mb-4"
          size="lg"
        >
          <TextWithVoice>Check Sentence</TextWithVoice>
        </Button>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl text-center mb-4 flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Perfect! "{currentSentence.complete}"</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <X className="w-6 h-6" />
              <TextWithVoice>Not quite! The correct sentence is:</TextWithVoice>
            </div>
            <p className="text-lg">
              <TextWithVoice>"{currentSentence.complete}"</TextWithVoice>
            </p>
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
                  i < questionsInStage ? 'bg-yellow-600' : 'bg-gray-200'
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