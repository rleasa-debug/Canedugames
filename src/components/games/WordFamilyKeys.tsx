import { useState, useEffect } from 'react';
import { useScore } from '../../contexts/ScoreContext';
import { useProgression } from '../../contexts/ProgressionContext';
import { TextWithVoice } from '../TextWithVoice';
import { Trophy, Star, Key, Check, X, ChevronRight, Home } from 'lucide-react';
import keyImage from 'figma:asset/333580ebb0e6cc87037f82611725116f972dbb14.png';

const STAGES_PER_LEVEL = 50;
const WORDS_PER_STAGE = 8;

// Word families organized by level (grade-appropriate)
const WORD_FAMILIES = {
  1: [
    { key: 'cat', family: 'at', words: ['bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'vat'] },
    { key: 'can', family: 'an', words: ['ban', 'fan', 'man', 'pan', 'ran', 'tan', 'van', 'Dan'] },
    { key: 'pig', family: 'ig', words: ['big', 'dig', 'fig', 'gig', 'jig', 'rig', 'wig', 'zig'] },
    { key: 'dog', family: 'og', words: ['bog', 'cog', 'fog', 'hog', 'jog', 'log', 'tog', 'bog'] },
    { key: 'sun', family: 'un', words: ['bun', 'fun', 'gun', 'hun', 'nun', 'pun', 'run', 'shun'] },
    { key: 'cut', family: 'ut', words: ['but', 'gut', 'hut', 'jut', 'nut', 'rut', 'shut', 'tut'] },
  ],
  2: [
    { key: 'back', family: 'ack', words: ['hack', 'jack', 'lack', 'pack', 'rack', 'sack', 'tack', 'black'] },
    { key: 'pick', family: 'ick', words: ['brick', 'chick', 'kick', 'lick', 'nick', 'quick', 'sick', 'tick'] },
    { key: 'rock', family: 'ock', words: ['block', 'clock', 'dock', 'flock', 'knock', 'lock', 'shock', 'sock'] },
    { key: 'bank', family: 'ank', words: ['blank', 'crank', 'drank', 'frank', 'plank', 'rank', 'sank', 'tank'] },
    { key: 'sink', family: 'ink', words: ['blink', 'brink', 'drink', 'link', 'pink', 'rink', 'stink', 'think'] },
    { key: 'bell', family: 'ell', words: ['cell', 'dell', 'fell', 'sell', 'shell', 'smell', 'spell', 'well'] },
  ],
  3: [
    { key: 'string', family: 'ing', words: ['bring', 'cling', 'fling', 'king', 'ring', 'sing', 'spring', 'wing'] },
    { key: 'chair', family: 'air', words: ['fair', 'flair', 'hair', 'pair', 'stair', 'Blair', 'Claire', 'lair'] },
    { key: 'sheep', family: 'eep', words: ['beep', 'creep', 'deep', 'jeep', 'keep', 'peep', 'sleep', 'steep'] },
    { key: 'train', family: 'ain', words: ['brain', 'chain', 'drain', 'grain', 'main', 'pain', 'plain', 'rain'] },
    { key: 'beach', family: 'each', words: ['bleach', 'peach', 'preach', 'reach', 'teach', 'breach', 'leach', 'beseech'] },
    { key: 'throne', family: 'one', words: ['bone', 'clone', 'cone', 'phone', 'stone', 'tone', 'zone', 'alone'] },
  ],
  4: [
    { key: 'light', family: 'ight', words: ['bright', 'fight', 'flight', 'fright', 'might', 'night', 'right', 'sight'] },
    { key: 'thought', family: 'ought', words: ['bought', 'brought', 'caught', 'fought', 'sought', 'taught', 'nought', 'drought'] },
    { key: 'daughter', family: 'aughter', words: ['laughter', 'slaughter', 'Slaughter', 'draughter', 'straighter', 'naughter', 'taughter', 'paughter'] },
    { key: 'storm', family: 'orm', words: ['form', 'norm', 'swarm', 'warm', 'conform', 'inform', 'perform', 'transform'] },
    { key: 'bird', family: 'ird', words: ['third', 'gird', 'weird', 'stirred', 'whirred', 'urred', 'erred', 'blurred'] },
    { key: 'world', family: 'orld', words: ['unfurled', 'twirled', 'swirled', 'curled', 'hurled', 'purled', 'furled', 'whirled'] },
  ],
  5: [
    { key: 'boat', family: 'oat', words: ['bloat', 'coat', 'float', 'goat', 'moat', 'throat', 'gloat', 'shoat'] },
    { key: 'cream', family: 'eam', words: ['beam', 'dream', 'gleam', 'scream', 'seam', 'steam', 'stream', 'team'] },
    { key: 'snail', family: 'ail', words: ['bail', 'fail', 'hail', 'jail', 'mail', 'pail', 'rail', 'sail'] },
    { key: 'tray', family: 'ay', words: ['bay', 'clay', 'day', 'gray', 'hay', 'may', 'play', 'pray'] },
    { key: 'freeze', family: 'eeze', words: ['breeze', 'cheese', 'sneeze', 'squeeze', 'wheeze', 'tweeze', 'sleaze', 'fleece'] },
    { key: 'cloud', family: 'oud', words: ['loud', 'proud', 'shroud', 'aloud', 'enshroud', 'becloud', 'uncloud', 'recloud'] },
  ],
  6: [
    { key: 'knight', family: 'knight', words: ['night', 'plight', 'blight', 'flight', 'slight', 'tight', 'wright', 'sight'] },
    { key: 'wreath', family: 'wr', words: ['wrap', 'wren', 'wreck', 'wring', 'write', 'wrong', 'wrote', 'wrung'] },
    { key: 'knot', family: 'kn', words: ['knack', 'knee', 'knew', 'knife', 'knock', 'know', 'known', 'knuckle'] },
    { key: 'thumb', family: 'mb', words: ['bomb', 'climb', 'comb', 'crumb', 'dumb', 'lamb', 'limb', 'numb'] },
    { key: 'ghost', family: 'gh', words: ['ghastly', 'gherkin', 'ghetto', 'ghoul', 'aghast', 'spaghetti', 'yoghurt', 'burgh'] },
    { key: 'gnome', family: 'gn', words: ['gnarl', 'gnash', 'gnat', 'gnaw', 'gnu', 'sign', 'resign', 'design'] },
  ],
  7: [
    { key: 'replay', family: 're-', words: ['redo', 'rebuild', 'recall', 'recycle', 'reread', 'restart', 'return', 'rewind'] },
    { key: 'unhappy', family: 'un-', words: ['unable', 'unbox', 'unclear', 'undo', 'unfair', 'unlock', 'unpack', 'unsafe'] },
    { key: 'helpful', family: '-ful', words: ['careful', 'cheerful', 'colorful', 'grateful', 'hopeful', 'joyful', 'peaceful', 'useful'] },
    { key: 'endless', family: '-less', words: ['careless', 'fearless', 'harmless', 'helpless', 'hopeless', 'mindless', 'painless', 'useless'] },
    { key: 'teacher', family: '-er', words: ['baker', 'dancer', 'farmer', 'helper', 'painter', 'player', 'reader', 'singer'] },
    { key: 'quickly', family: '-ly', words: ['badly', 'clearly', 'deadly', 'firmly', 'greatly', 'kindly', 'loudly', 'safely'] },
  ],
  8: [
    { key: 'basketball', family: 'ball', words: ['baseball', 'football', 'handball', 'meatball', 'snowball', 'volleyball', 'eyeball', 'gumball'] },
    { key: 'butterfly', family: 'fly', words: ['dragonfly', 'firefly', 'horsefly', 'housefly', 'mayfly', 'blackfly', 'gadfly', 'damselfly'] },
    { key: 'afternoon', family: 'noon', words: ['honeymoon', 'cartoon', 'festoon', 'harpoon', 'maroon', 'monsoon', 'platoon', 'raccoon'] },
    { key: 'waterfall', family: 'fall', words: ['downfall', 'footfall', 'freefall', 'landfall', 'nightfall', 'rainfall', 'shortfall', 'windfall'] },
    { key: 'understand', family: 'stand', words: ['bandstand', 'grandstand', 'handstand', 'kickstand', 'newsstand', 'withstand', 'headstand', 'inkstand'] },
    { key: 'lighthouse', family: 'house', words: ['clubhouse', 'doghouse', 'farmhouse', 'greenhouse', 'outhouse', 'playhouse', 'treehouse', 'warehouse'] },
  ],
  9: [
    { key: 'education', family: '-tion', words: ['action', 'attention', 'caution', 'creation', 'emotion', 'fiction', 'motion', 'nation'] },
    { key: 'invisible', family: '-ible', words: ['audible', 'edible', 'flexible', 'horrible', 'possible', 'sensible', 'terrible', 'visible'] },
    { key: 'portable', family: '-able', words: ['comfortable', 'enjoyable', 'favorable', 'lovable', 'notable', 'readable', 'valuable', 'washable'] },
    { key: 'happiness', family: '-ness', words: ['brightness', 'darkness', 'fairness', 'goodness', 'kindness', 'sadness', 'sickness', 'weakness'] },
    { key: 'beautiful', family: '-ful', words: ['delightful', 'faithful', 'graceful', 'meaningful', 'powerful', 'respectful', 'thoughtful', 'wonderful'] },
    { key: 'apartment', family: '-ment', words: ['agreement', 'basement', 'excitement', 'government', 'movement', 'payment', 'statement', 'treatment'] },
  ],
  10: [
    { key: 'biography', family: '-graphy', words: ['bibliography', 'calligraphy', 'choreography', 'geography', 'photography', 'radiography', 'typography', 'topography'] },
    { key: 'democracy', family: '-cracy', words: ['aristocracy', 'autocracy', 'bureaucracy', 'meritocracy', 'plutocracy', 'technocracy', 'theocracy', 'ochlocracy'] },
    { key: 'psychologist', family: '-logist', words: ['anthropologist', 'archaeologist', 'biologist', 'ecologist', 'geologist', 'meteorologist', 'sociologist', 'zoologist'] },
    { key: 'telephone', family: '-phone', words: ['cellphone', 'headphone', 'microphone', 'saxophone', 'xylophone', 'megaphone', 'gramophone', 'vibraphone'] },
    { key: 'autobiography', family: 'auto-', words: ['autocrat', 'autograph', 'automate', 'automatic', 'automobile', 'autonomous', 'autopilot', 'autocorrect'] },
    { key: 'thermometer', family: '-meter', words: ['barometer', 'centimeter', 'diameter', 'kilometer', 'odometer', 'parameter', 'perimeter', 'speedometer'] },
  ],
};

interface WordFamilyKeysProps {
  onBack: () => void;
}

export default function WordFamilyKeys({ onBack }: WordFamilyKeysProps) {
  const { recordAnswer } = useScore();
  const { 
    getCurrentLevel,
    getStagesCompleted,
    getAccuracyAtCurrentLevel,
    recordStageCompletion,
    canLevelUp,
    levelUp
  } = useProgression();

  const gameId = 'wordfamily';
  const currentLevel = getCurrentLevel(gameId);
  const currentStage = getStagesCompleted(gameId);
  const accuracy = getAccuracyAtCurrentLevel(gameId);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentFamily, setCurrentFamily] = useState<typeof WORD_FAMILIES[1][0] | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [stageCorrect, setStageCorrect] = useState(0);
  const [stageTotal, setStageTotal] = useState(0);
  const [questionsInStage, setQuestionsInStage] = useState(0);

  const QUESTIONS_PER_STAGE = 8;

  // Initialize new round
  useEffect(() => {
    startNewRound();
  }, [currentLevel, currentStage]);

  const startNewRound = () => {
    const families = WORD_FAMILIES[currentLevel as keyof typeof WORD_FAMILIES] || WORD_FAMILIES[1];
    const randomFamily = families[Math.floor(Math.random() * families.length)];
    
    // Get words from this family and a random different family for variety
    const otherFamilies = families.filter(f => f.family !== randomFamily.family);
    const otherFamily = otherFamilies[Math.floor(Math.random() * otherFamilies.length)];
    
    // Select 4 words from the correct family and 4 from another family
    const correctWords = randomFamily.words.slice(0, 4);
    const incorrectWords = otherFamily ? otherFamily.words.slice(0, 4) : [];
    
    const allWords = [...correctWords, ...incorrectWords];
    const shuffled = allWords.sort(() => Math.random() - 0.5);
    
    setCurrentFamily(randomFamily);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setFeedback(null);
  };

  const handleWordSelect = (word: string) => {
    if (feedback) return; // Don't allow selection during feedback
    
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswer = async () => {
    if (!currentFamily || selectedWords.length === 0) return;
    
    // Check if all selected words belong to the current family
    const allCorrect = selectedWords.every(word => 
      currentFamily.words.includes(word)
    );
    
    const noIncorrect = selectedWords.length > 0;
    const hasEnough = selectedWords.length >= 4;
    
    const isCorrect = allCorrect && hasEnough;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTotalQuestions(prev => prev + 1);
    recordAnswer(isCorrect, 'literacy');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStageCorrect(stageCorrect + 1);
    }
    
    setStageTotal(stageTotal + 1);
    setQuestionsInStage(questionsInStage + 1);
    
    setTimeout(async () => {
      if (questionsInStage + 1 >= QUESTIONS_PER_STAGE) {
        // Complete the stage
        await recordStageCompletion(gameId, isCorrect ? stageCorrect + 1 : stageCorrect, stageTotal + 1);
        
        setStageCorrect(0);
        setStageTotal(0);
        setQuestionsInStage(0);
        
        // Check for level up
        if (canLevelUp(gameId)) {
          setShowLevelUpModal(true);
        } else {
          startNewRound();
        }
      } else {
        startNewRound();
      }
    }, 2000);
  };

  const handleLevelUpContinue = async () => {
    await levelUp(gameId);
    setShowLevelUpModal(false);
    startNewRound();
  };

  if (!currentFamily) return null;

  const proficiency = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Back to Games</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-red-600 mb-2">
                <TextWithVoice>Word Family Keys</TextWithVoice>
              </h1>
              <p className="text-gray-600">
                <TextWithVoice>Match words to the correct key!</TextWithVoice>
              </p>
            </div>
            <Key className="w-12 h-12 text-red-500" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Level {currentLevel} - Stage {currentStage}/{STAGES_PER_LEVEL}</span>
              <span>{proficiency.toFixed(0)}% Accuracy</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStage / STAGES_PER_LEVEL) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {accuracy.toFixed(0)}% accuracy at Level {currentLevel} (Need 77% to level up)
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-4">
          {/* Key Display - More Compact */}
          <div className="text-center mb-4">
            <div className="inline-block relative">
              <img 
                src={keyImage} 
                alt="Key" 
                className="w-32 h-32 object-contain mx-auto mb-2"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-red-500">
                  <TextWithVoice>
                    <span className="text-2xl font-bold text-red-600">{currentFamily.key}</span>
                  </TextWithVoice>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <TextWithVoice>Select all words that rhyme with "{currentFamily.key}" (Word family: -{currentFamily.family})</TextWithVoice>
            </p>
          </div>

          {/* Word Grid - More Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {shuffledWords.map((word, idx) => {
              const isSelected = selectedWords.includes(word);
              const isCorrectWord = currentFamily.words.includes(word);
              
              let bgColor = 'bg-gray-100 hover:bg-gray-200';
              let borderColor = 'border-gray-300';
              
              if (isSelected && !feedback) {
                bgColor = 'bg-red-100';
                borderColor = 'border-red-400';
              }
              
              if (feedback === 'correct' && isSelected) {
                bgColor = 'bg-green-100';
                borderColor = 'border-green-500';
              }
              
              if (feedback === 'incorrect') {
                if (isSelected && !isCorrectWord) {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-500';
                }
                if (isCorrectWord) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-green-400';
                }
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleWordSelect(word)}
                  disabled={!!feedback}
                  className={`${bgColor} ${borderColor} border-3 rounded-lg p-4 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed relative`}
                >
                  <TextWithVoice>
                    <span className="text-xl font-bold text-gray-800">{word}</span>
                  </TextWithVoice>
                  
                  {isSelected && !feedback && (
                    <div className="absolute top-1 right-1">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {feedback === 'correct' && isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {feedback === 'incorrect' && isSelected && !isCorrectWord && (
                    <div className="absolute top-1 right-1">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit Button and Feedback - Combined Section */}
          <div className="space-y-3">
            {!feedback && (
              <div className="text-center">
                <button
                  onClick={checkAnswer}
                  disabled={selectedWords.length === 0}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <TextWithVoice>
                    <span className="flex items-center gap-2">
                      Check Answer
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </TextWithVoice>
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg text-center ${
                feedback === 'correct' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {feedback === 'correct' ? (
                    <>
                      <Star className="w-6 h-6 text-green-600 fill-green-600" />
                      <h3 className="text-base text-green-800">
                        <TextWithVoice>Excellent! All correct!</TextWithVoice>
                      </h3>
                      <Star className="w-6 h-6 text-green-600 fill-green-600" />
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 text-red-600" />
                      <h3 className="text-base text-red-800">
                        <TextWithVoice>Try again! Look for words that rhyme.</TextWithVoice>
                      </h3>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center transform animate-bounce">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 fill-yellow-500" />
            <h2 className="text-red-600 mb-4">
              <TextWithVoice>Level Up! 🎉</TextWithVoice>
            </h2>
            <p className="text-gray-700 mb-6">
              <TextWithVoice>
                Congratulations! You've advanced to Level {currentLevel}!
              </TextWithVoice>
            </p>
            <button
              onClick={handleLevelUpContinue}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <TextWithVoice>Continue</TextWithVoice>
            </button>
          </div>
        </div>
      )}

      {/* Stage Celebration */}
      {showCelebration && !showLevelUpModal && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 fill-white" />
            <span className="text-xl font-bold">Stage Complete! 🎯</span>
          </div>
        </div>
      )}
    </div>
  );
}