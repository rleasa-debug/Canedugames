import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft, Trophy, Star, Sparkles, ChevronRight } from 'lucide-react';
import { TextWithVoice } from './TextWithVoice';
import { useScore } from '../contexts/ScoreContext';

interface MathMatchingGameProps {
  onBack: () => void;
}

interface Question {
  expression: string;
  correctAnswer: number;
  options: number[];
  visual?: boolean;
}

const AnswerOption = ({
  answer,
  isCorrect,
  isSelected,
  isRevealed,
  showVisual,
  onClick,
}: {
  answer: number;
  isCorrect: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  showVisual: boolean;
  onClick: () => void;
}) => {
  const renderVisual = () => {
    if (!showVisual || answer > 20 || answer < 1) {
      return (
        <div className="text-3xl md:text-4xl font-bold text-gray-700">
          {answer}
        </div>
      );
    }

    if (answer <= 10) {
      // Show dots
      return (
        <div className="flex flex-wrap gap-2 justify-center items-center p-3">
          {Array.from({ length: answer }).map((_, i) => (
            <div key={i} className="w-7 h-7 bg-purple-500 rounded-full shadow-md" />
          ))}
        </div>
      );
    } else {
      // Show tens and ones blocks
      const tens = Math.floor(answer / 10);
      const ones = answer % 10;
      return (
        <div className="flex gap-3 justify-center items-center p-3">
          {Array.from({ length: tens }).map((_, i) => (
            <div key={`ten-${i}`} className="flex flex-col gap-0.5">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="w-7 h-2.5 bg-orange-500 border border-orange-600" />
              ))}
            </div>
          ))}
          {ones > 0 && (
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: ones }).map((_, i) => (
                <div key={`one-${i}`} className="w-7 h-2.5 bg-red-500 border border-red-600" />
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <motion.button
      whileHover={!isRevealed ? { scale: 1.05 } : {}}
      whileTap={!isRevealed ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isRevealed}
      className={`relative border-4 rounded-xl min-h-[140px] p-4 flex flex-col items-center justify-center transition-all ${
        isRevealed && isCorrect
          ? 'border-green-500 bg-green-50'
          : isRevealed && isSelected
          ? 'border-red-500 bg-red-50'
          : isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
      } ${isRevealed ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {renderVisual()}
      
      {isRevealed && isCorrect && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg"
        >
          <Star className="w-6 h-6 fill-white" />
        </motion.div>
      )}
    </motion.button>
  );
};

export function MathMatchingGame({ onBack }: MathMatchingGameProps) {
  const { recordAnswer } = useScore();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const generateQuestions = (level: number): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 0; i < 20; i++) {
      let question: Question;
      
      if (level === 1) {
        // Grade 1: Addition 1-10 with visuals
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const answer = a + b;
        question = {
          expression: `${a} + ${b}`,
          correctAnswer: answer,
          options: generateOptions(answer, 1, 10),
          visual: true,
        };
      } else if (level === 2) {
        // Grade 2: Addition/Subtraction 1-20 with blocks
        const isAddition = Math.random() > 0.3;
        if (isAddition) {
          const a = Math.floor(Math.random() * 10) + 5;
          const b = Math.floor(Math.random() * 10) + 1;
          const answer = a + b;
          question = {
            expression: `${a} + ${b}`,
            correctAnswer: answer,
            options: generateOptions(answer, 5, 20),
            visual: true,
          };
        } else {
          const a = Math.floor(Math.random() * 15) + 10;
          const b = Math.floor(Math.random() * (a - 5)) + 1;
          const answer = a - b;
          question = {
            expression: `${a} - ${b}`,
            correctAnswer: answer,
            options: generateOptions(answer, 1, 20),
            visual: true,
          };
        }
      } else if (level === 3) {
        // Grade 3: Multiplication tables
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const answer = a * b;
        question = {
          expression: `${a} × ${b}`,
          correctAnswer: answer,
          options: generateOptions(answer, 4, 100),
          visual: false,
        };
      } else if (level === 4) {
        // Grade 4: Mixed operations
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;
        
        if (op === '+') {
          a = Math.floor(Math.random() * 50) + 10;
          b = Math.floor(Math.random() * 50) + 10;
          answer = a + b;
        } else if (op === '-') {
          a = Math.floor(Math.random() * 80) + 20;
          b = Math.floor(Math.random() * 40) + 5;
          answer = a - b;
        } else {
          a = Math.floor(Math.random() * 12) + 2;
          b = Math.floor(Math.random() * 12) + 2;
          answer = a * b;
        }
        
        question = {
          expression: `${a} ${op} ${b}`,
          correctAnswer: answer,
          options: generateOptions(answer, 10, 150),
          visual: false,
        };
      } else if (level === 5) {
        // Grade 5: Decimals and basic fractions
        const useDecimal = Math.random() > 0.5;
        
        if (useDecimal) {
          const a = (Math.floor(Math.random() * 20) + 5) / 10;
          const b = (Math.floor(Math.random() * 20) + 5) / 10;
          const answer = Math.round((a + b) * 10) / 10;
          question = {
            expression: `${a} + ${b}`,
            correctAnswer: answer,
            options: generateDecimalOptions(answer),
            visual: false,
          };
        } else {
          // Simple fraction multiplication
          const whole = Math.floor(Math.random() * 5) + 2;
          const multiplier = Math.floor(Math.random() * 4) + 2;
          const answer = whole * multiplier;
          question = {
            expression: `${whole} × ${multiplier}`,
            correctAnswer: answer,
            options: generateOptions(answer, 4, 30),
            visual: false,
          };
        }
      } else if (level === 6) {
        // Grade 6: Simple algebra (result only)
        const answer = Math.floor(Math.random() * 20) + 5;
        const constant = Math.floor(Math.random() * 15) + 3;
        const result = answer + constant;
        question = {
          expression: `x + ${constant} = ${result}. What is x?`,
          correctAnswer: answer,
          options: generateOptions(answer, 1, 30),
          visual: false,
        };
      } else if (level === 7) {
        // Grade 7: Two-step equations (result only)
        const answer = Math.floor(Math.random() * 15) + 2;
        const multiplier = Math.floor(Math.random() * 4) + 2;
        const constant = Math.floor(Math.random() * 10) + 3;
        const result = multiplier * answer + constant;
        question = {
          expression: `${multiplier}x + ${constant} = ${result}. What is x?`,
          correctAnswer: answer,
          options: generateOptions(answer, 1, 25),
          visual: false,
        };
      } else if (level === 8) {
        // Grade 8: Exponents and roots
        const useExponent = Math.random() > 0.5;
        
        if (useExponent) {
          const base = Math.floor(Math.random() * 5) + 2;
          const exp = Math.floor(Math.random() * 3) + 2;
          const answer = Math.pow(base, exp);
          question = {
            expression: `${base}${exp === 2 ? '²' : exp === 3 ? '³' : `^${exp}`}`,
            correctAnswer: answer,
            options: generateOptions(answer, 4, 200),
            visual: false,
          };
        } else {
          const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
          const square = squares[Math.floor(Math.random() * squares.length)];
          const answer = Math.sqrt(square);
          question = {
            expression: `√${square}`,
            correctAnswer: answer,
            options: generateOptions(answer, 2, 15),
            visual: false,
          };
        }
      } else if (level === 9) {
        // Grade 9: Order of operations
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 10) + 5;
        const answer = a * b + c;
        question = {
          expression: `${a} × ${b} + ${c}`,
          correctAnswer: answer,
          options: generateOptions(answer, 15, 100),
          visual: false,
        };
      } else {
        // Grade 10: Mixed advanced
        const types = ['exponent', 'sqrt', 'order'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'exponent') {
          const base = Math.floor(Math.random() * 4) + 2;
          const exp = Math.floor(Math.random() * 3) + 3;
          const answer = Math.pow(base, exp);
          question = {
            expression: `${base}^${exp}`,
            correctAnswer: answer,
            options: generateOptions(answer, 10, 300),
            visual: false,
          };
        } else if (type === 'sqrt') {
          const squares = [64, 81, 100, 121, 144, 169, 196, 225];
          const square = squares[Math.floor(Math.random() * squares.length)];
          const answer = Math.sqrt(square);
          question = {
            expression: `√${square}`,
            correctAnswer: answer,
            options: generateOptions(answer, 5, 20),
            visual: false,
          };
        } else {
          const a = Math.floor(Math.random() * 10) + 5;
          const b = Math.floor(Math.random() * 5) + 2;
          const c = Math.floor(Math.random() * 15) + 10;
          const answer = a * b - c;
          question = {
            expression: `${a} × ${b} - ${c}`,
            correctAnswer: answer,
            options: generateOptions(answer, 10, 80),
            visual: false,
          };
        }
      }
      
      questions.push(question);
    }
    
    return questions;
  };

  const generateOptions = (correct: number, min: number, max: number): number[] => {
    const options = new Set<number>([correct]);
    
    while (options.size < 4) {
      let option: number;
      const variance = Math.max(5, Math.floor((max - min) / 10));
      
      // Generate options near the correct answer
      const diff = Math.floor(Math.random() * variance * 2) - variance;
      option = correct + diff;
      
      if (option >= min && option <= max && option !== correct) {
        options.add(option);
      }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const generateDecimalOptions = (correct: number): number[] => {
    const options = new Set<number>([correct]);
    
    while (options.size < 4) {
      const diff = (Math.floor(Math.random() * 10) - 5) / 10;
      const option = Math.round((correct + diff) * 10) / 10;
      
      if (option > 0 && option !== correct) {
        options.add(option);
      }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const newQuestions = generateQuestions(currentLevel);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setLevelComplete(false);
  }, [currentLevel]);

  const handleAnswerSelect = (answer: number) => {
    if (isRevealed) return;
    
    setSelectedAnswer(answer);
    setIsRevealed(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    // Record answer for analytics
    recordAnswer('numeracy', isCorrect);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    // Auto-advance after a delay
    setTimeout(() => {
      if (currentQuestion < 19) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsRevealed(false);
      } else {
        // Level complete
        setLevelComplete(true);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }, 1500);
  };

  const nextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setCurrentLevel(1);
    }
  };

  const restartLevel = () => {
    const newQuestions = generateQuestions(currentLevel);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setLevelComplete(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-semibold">
                  Level {currentLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-semibold">
                  {score}/{questions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl mb-2">
              <TextWithVoice>Math Challenge</TextWithVoice>
            </h1>
            <p className="text-gray-600">
              <TextWithVoice>
                Question {currentQuestion + 1} of {questions.length}
              </TextWithVoice>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {!levelComplete ? (
          <>
            {/* Question */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-6 text-center"
            >
              <h2 className="text-2xl md:text-3xl mb-4 text-gray-600">
                <TextWithVoice>What is:</TextWithVoice>
              </h2>
              <div className="text-4xl md:text-6xl font-bold text-purple-700 mb-8">
                <TextWithVoice>{currentQ.expression}</TextWithVoice>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                {currentQ.options.map((option) => (
                  <AnswerOption
                    key={option}
                    answer={option}
                    isCorrect={option === currentQ.correctAnswer}
                    isSelected={selectedAnswer === option}
                    isRevealed={isRevealed}
                    showVisual={currentQ.visual || false}
                    onClick={() => handleAnswerSelect(option)}
                  />
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Level Complete */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
            >
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="mb-6"
                  >
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-2xl shadow-2xl">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-8 h-8" />
                        <span className="text-2xl font-bold">Level Complete!</span>
                        <Sparkles className="w-8 h-8" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500 fill-yellow-500" />
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Great Job!
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-2">
                You scored:
              </p>
              
              <p className="text-5xl md:text-6xl font-bold text-purple-700 mb-8">
                {score} / {questions.length}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={restartLevel}
                  variant="outline"
                  size="lg"
                  className="bg-white"
                >
                  Try Again
                </Button>
                
                <Button
                  onClick={nextLevel}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                >
                  {currentLevel < 10 ? 'Next Level' : 'Level 1'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
