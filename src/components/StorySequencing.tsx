import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { speak } from "../utils/voice";
import { TextWithVoice } from "./TextWithVoice";
import { useScore } from "../contexts/ScoreContext";
import { useProgression } from "../contexts/ProgressionContext";
import { LevelDisplay } from "./LevelDisplay";
import { LevelUpModal } from "./LevelUpModal";

interface StorySequencingProps {
  onBack: () => void;
}

interface Story {
  title: string;
  steps: string[];
}

// Stories organized by complexity level
const storiesByLevel: Record<number, Story[]> = {
  1: [
    { title: "Wash Your Hands", steps: ["Turn on water", "Use soap", "Rinse hands", "Dry with towel"] },
    { title: "Brush Your Teeth", steps: ["Get toothbrush", "Put toothpaste on", "Brush teeth", "Rinse mouth"] },
  ],
  2: [
    { title: "Make a Sandwich", steps: ["Get bread", "Add peanut butter", "Add jam", "Put slices together", "Eat sandwich"] },
    { title: "Get Dressed", steps: ["Wake up", "Put on shirt", "Put on pants", "Put on socks", "Put on shoes"] },
  ],
  3: [
    { title: "Plant a Seed", steps: ["Dig small hole", "Put seed in hole", "Cover with soil", "Water the soil", "Wait for it to grow"] },
    { title: "Ready for School", steps: ["Wake up", "Brush teeth", "Get dressed", "Eat breakfast", "Pack backpack"] },
  ],
  4: [
    { title: "Make Hot Chocolate", steps: ["Boil water", "Pour water in cup", "Add cocoa mix", "Stir well", "Add marshmallows", "Enjoy drink"] },
    { title: "Build Snowman", steps: ["Make big snowball", "Make medium snowball", "Make small snowball", "Stack them up", "Add face and arms"] },
  ],
  5: [
    { title: "Bake Cookies", steps: ["Mix ingredients", "Roll dough", "Cut shapes", "Bake in oven", "Let cool", "Decorate cookies"] },
    { title: "Write a Story", steps: ["Think of idea", "Write beginning", "Write middle", "Write ending", "Read and edit", "Share with friends"] },
  ],
  6: [
    { title: "Science Experiment", steps: ["Form hypothesis", "Gather materials", "Conduct experiment", "Record observations", "Analyze results", "Draw conclusions"] },
    { title: "Plan Birthday Party", steps: ["Choose date", "Make guest list", "Send invitations", "Plan activities", "Prepare food", "Celebrate together"] },
  ],
  7: [
    { title: "Research Project", steps: ["Choose topic", "Find sources", "Take notes", "Create outline", "Write draft", "Revise and edit", "Present findings"] },
    { title: "Community Garden", steps: ["Find location", "Get permission", "Prepare soil", "Plan layout", "Plant seeds", "Water regularly", "Harvest vegetables"] },
  ],
  8: [
    { title: "Start a Business", steps: ["Identify problem", "Research market", "Create business plan", "Secure funding", "Launch product", "Market to customers", "Evaluate success"] },
    { title: "Scientific Method", steps: ["Ask question", "Research background", "Form hypothesis", "Design experiment", "Collect data", "Analyze results", "Communicate findings"] },
  ],
  9: [
    { title: "Novel Writing Process", steps: ["Develop characters", "Outline plot structure", "Write first draft", "Revise for content", "Edit for grammar", "Get beta feedback", "Prepare for publication"] },
    { title: "Archaeological Dig", steps: ["Survey site", "Establish grid system", "Excavate layers", "Document findings", "Preserve artifacts", "Analyze discoveries", "Publish research"] },
  ],
  10: [
    { title: "Thesis Development", steps: ["Identify research gap", "Formulate research questions", "Conduct literature review", "Design methodology", "Collect and analyze data", "Interpret findings", "Write and defend thesis"] },
    { title: "Policy Implementation", steps: ["Identify need", "Research best practices", "Draft policy proposal", "Consult stakeholders", "Revise based on feedback", "Approve and adopt", "Monitor and evaluate"] },
  ],
};

export function StorySequencing({ onBack }: StorySequencingProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel, 
    getStagesCompleted, 
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = "story";
  const currentLevel = getCurrentLevel(gameId);
  const stagesCompleted = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const QUESTIONS_PER_STAGE = 5;

  const generateQuestion = () => {
    const levelStories = storiesByLevel[currentLevel] || storiesByLevel[1];
    const randomStory = levelStories[Math.floor(Math.random() * levelStories.length)];
    
    // Shuffle the steps
    const shuffled = [...randomStory.steps].sort(() => Math.random() - 0.5);
    
    setCurrentStory(randomStory);
    setUserOrder(shuffled);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const moveUp = (index: number) => {
    if (index === 0 || feedback !== null) return;
    const newOrder = [...userOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setUserOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === userOrder.length - 1 || feedback !== null) return;
    const newOrder = [...userOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setUserOrder(newOrder);
  };

  const checkOrder = () => {
    if (!currentStory) return;

    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentStory.steps);
    
    if (isCorrect) {
      setFeedback("correct");
      setStageCorrect(stageCorrect + 1);
      recordAnswer(true, 'literacy');
      speak("Perfect order!");
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

  if (!currentStory) {
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
            <TextWithVoice>📖 Story Time in the North - Level {currentLevel}</TextWithVoice>
          </h2>
          <p className="text-gray-600">
            <TextWithVoice>Story {questionsInStage + 1} of {QUESTIONS_PER_STAGE}</TextWithVoice>
          </p>
        </div>

        {/* Story Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-violet-700">
            <TextWithVoice>{currentStory.title}</TextWithVoice>
          </h3>
          <p className="text-gray-600 mt-2">
            <TextWithVoice>Put the steps in the correct order!</TextWithVoice>
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {userOrder.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                feedback === "correct"
                  ? "bg-green-50 border-green-300"
                  : feedback === "incorrect"
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || feedback !== null}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-8 p-0"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => moveDown(index)}
                  disabled={index === userOrder.length - 1 || feedback !== null}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-8 p-0"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-lg">
                  <TextWithVoice>{step}</TextWithVoice>
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={checkOrder}
          disabled={feedback !== null}
          className="w-full"
          size="lg"
        >
          <TextWithVoice>Check Order</TextWithVoice>
        </Button>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="text-green-600 text-xl mt-4 text-center flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <TextWithVoice>Perfect! That's the correct order!</TextWithVoice>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="text-red-600 text-xl mt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <X className="w-6 h-6" />
              <TextWithVoice>Not quite! The correct order is:</TextWithVoice>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              {currentStory.steps.map((step, i) => (
                <p key={i}>
                  <TextWithVoice>{i + 1}. {step}</TextWithVoice>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Stage Progress */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600 text-center mb-2">
            <TextWithVoice>Stage Progress</TextWithVoice>
          </div>
          <div className="flex gap-2 justify-center">
            {[...Array(QUESTIONS_PER_STAGE)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
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