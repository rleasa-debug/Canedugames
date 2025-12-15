import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface WordProblem {
  base: string;
  prefix?: string;
  suffix?: string;
  complete: string;
  type: "prefix" | "suffix";
  options: string[];
}

// Prefix/Suffix problems by level
const problemsByLevel: Record<number, WordProblem[]> = {
  1: [
    { base: "happy", suffix: "ness", complete: "happiness", type: "suffix", options: ["ness", "ly", "ful", "less"] },
    { base: "play", suffix: "ing", complete: "playing", type: "suffix", options: ["ing", "ed", "er", "s"] },
  ],
  2: [
    { base: "kind", suffix: "ness", complete: "kindness", type: "suffix", options: ["ness", "ly", "ful", "less"] },
    { base: "do", prefix: "un", complete: "undo", type: "prefix", options: ["un", "re", "pre", "dis"] },
  ],
  3: [
    { base: "write", prefix: "re", complete: "rewrite", type: "prefix", options: ["re", "un", "pre", "dis"] },
    { base: "care", suffix: "ful", complete: "careful", type: "suffix", options: ["ful", "less", "ly", "ness"] },
  ],
  4: [
    { base: "view", prefix: "pre", complete: "preview", type: "prefix", options: ["pre", "re", "un", "dis"] },
    { base: "agree", prefix: "dis", complete: "disagree", type: "prefix", options: ["dis", "un", "re", "pre"] },
  ],
  5: [
    { base: "comfort", suffix: "able", complete: "comfortable", type: "suffix", options: ["able", "ible", "ous", "ive"] },
    { base: "marine", prefix: "sub", complete: "submarine", type: "prefix", options: ["sub", "super", "trans", "inter"] },
  ],
  6: [
    { base: "pass", prefix: "sur", complete: "surpass", type: "prefix", options: ["sur", "sub", "super", "trans"] },
    { base: "develop", suffix: "ment", complete: "development", type: "suffix", options: ["ment", "ness", "tion", "sion"] },
  ],
  7: [
    { base: "act", suffix: "tion", complete: "action", type: "suffix", options: ["tion", "sion", "ment", "ness"] },
    { base: "port", prefix: "trans", complete: "transport", type: "prefix", options: ["trans", "inter", "sub", "super"] },
  ],
  8: [
    { base: "nation", prefix: "inter", complete: "international", type: "prefix", options: ["inter", "trans", "sub", "super"] },
    { base: "danger", suffix: "ous", complete: "dangerous", type: "suffix", options: ["ous", "ive", "able", "ible"] },
  ],
  9: [
    { base: "respond", suffix: "ive", complete: "responsive", type: "suffix", options: ["ive", "ous", "able", "ible"] },
    { base: "structure", prefix: "infra", complete: "infrastructure", type: "prefix", options: ["infra", "ultra", "meta", "hyper"] },
  ],
  10: [
    { base: "cognition", prefix: "meta", complete: "metacognition", type: "prefix", options: ["meta", "infra", "ultra", "hyper"] },
    { base: "comprehend", suffix: "ible", complete: "comprehensible", type: "suffix", options: ["ible", "able", "ive", "ous"] },
  ],
};

export function PrefixSuffixGame({ onBack }: { onBack: () => void }) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "prefixsuffix";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentProblem, setCurrentProblem] = useState<WordProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 8;

  const generateQuestion = () => {
    const levelProblems = problemsByLevel[currentLevel] || problemsByLevel[1];
    const randomProblem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
    
    setCurrentProblem(randomProblem);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const handleAnswer = (answer: string) => {
    if (feedback !== null || !currentProblem) return;

    setSelectedAnswer(answer);
    const correctAffix = currentProblem.type === "prefix" ? currentProblem.prefix : currentProblem.suffix;
    const isCorrect = answer === correctAffix;
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak(`Correct! ${currentProblem.complete}`);
    } else {
      setFeedback("incorrect");
      recordAnswer(false, 'literacy');
      speak(`Incorrect. The answer is ${currentProblem.complete}`);
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

  if (!currentProblem) {
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
            <TextWithVoice>📚 Prefix & Suffix Practice - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Question {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Problem */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">
            <TextWithVoice>
              What {currentProblem.type} makes: "{currentProblem.complete}"?
            </TextWithVoice>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            {currentProblem.type === "prefix" && (
              <>
                <div className="text-3xl font-bold bg-violet-100 px-6 py-4 rounded-lg border-2 border-violet-300">
                  ?
                </div>
                <span className="text-3xl">+</span>
                <div className="text-3xl font-bold bg-blue-100 px-6 py-4 rounded-lg border-2 border-blue-300">
                  {currentProblem.base}
                </div>
              </>
            )}
            {currentProblem.type === "suffix" && (
              <>
                <div className="text-3xl font-bold bg-blue-100 px-6 py-4 rounded-lg border-2 border-blue-300">
                  {currentProblem.base}
                </div>
                <span className="text-3xl">+</span>
                <div className="text-3xl font-bold bg-violet-100 px-6 py-4 rounded-lg border-2 border-violet-300">
                  ?
                </div>
              </>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentProblem.options.map((option, index) => (
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
              className={`p-6 text-2xl h-auto ${
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
            <TextWithVoice>Correct! {currentProblem.complete}</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mb-4 flex items-center justify-center gap-2">
            <X className="w-6 h-6" />
            <TextWithVoice>Incorrect. The answer is {currentProblem.type === "prefix" ? currentProblem.prefix : currentProblem.suffix}</TextWithVoice>
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
                  i < questionsInStage ? 'bg-violet-600' : 'bg-gray-200'
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