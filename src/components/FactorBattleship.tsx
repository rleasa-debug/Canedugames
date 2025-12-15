import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { ArrowLeft, Target, Anchor, Waves, Trophy, Zap, Ship } from "lucide-react";
import { useScore } from "../contexts/ScoreContext";
import { TextWithVoice } from "./TextWithVoice";
import multiplicationChart from "figma:asset/9f1cf16d53f14febe9a6de0bad37d154fbba2c59.png";

interface FactorBattleshipProps {
  onBack: () => void;
}

type CellState = 'water' | 'hit' | 'miss' | 'revealed';

interface Cell {
  row: number;
  col: number;
  state: CellState;
  product: number;
}

export function FactorBattleship({ onBack }: FactorBattleshipProps) {
  const { recordAnswer } = useScore();
  const [targetNumber, setTargetNumber] = useState(24);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [factorPairs, setFactorPairs] = useState<Set<string>>(new Set());
  const [foundPairs, setFoundPairs] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [lastHit, setLastHit] = useState<{row: number, col: number} | null>(null);
  const [combo, setCombo] = useState(0);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Pick a random target number between 12 and 72
    const targets = [12, 18, 24, 30, 36, 40, 42, 48, 54, 60, 72];
    const newTarget = targets[Math.floor(Math.random() * targets.length)];
    setTargetNumber(newTarget);
    
    // Find all factor pairs for this number
    const pairs = new Set<string>();
    for (let i = 1; i <= 12; i++) {
      for (let j = 1; j <= 12; j++) {
        if (i * j === newTarget) {
          pairs.add(`${i}-${j}`);
        }
      }
    }
    setFactorPairs(pairs);
    setFoundPairs(new Set());
    
    // Initialize grid
    const newGrid: Cell[][] = [];
    for (let row = 1; row <= 12; row++) {
      const rowCells: Cell[] = [];
      for (let col = 1; col <= 12; col++) {
        rowCells.push({
          row,
          col,
          state: 'water',
          product: row * col
        });
      }
      newGrid.push(rowCells);
    }
    setGrid(newGrid);
    setScore(0);
    setTotalShots(0);
    setGameComplete(false);
    setCombo(0);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameComplete) return;
    
    const cell = grid[row - 1][col - 1];
    if (cell.state !== 'water') return; // Already clicked
    
    setTotalShots(prev => prev + 1);
    
    const pairKey = `${row}-${col}`;
    const isHit = factorPairs.has(pairKey);
    
    // Update grid
    const newGrid = [...grid];
    newGrid[row - 1][col - 1] = {
      ...cell,
      state: isHit ? 'hit' : 'miss'
    };
    setGrid(newGrid);
    
    if (isHit) {
      // Hit!
      setScore(prev => prev + 10 + (combo * 5));
      setCombo(prev => prev + 1);
      setLastHit({ row, col });
      recordAnswer('numeracy', true);
      
      const newFoundPairs = new Set(foundPairs);
      newFoundPairs.add(pairKey);
      setFoundPairs(newFoundPairs);
      
      // Check if game complete
      if (newFoundPairs.size === factorPairs.size) {
        setGameComplete(true);
        // Reveal all cells
        setTimeout(() => {
          const revealedGrid = newGrid.map(row => 
            row.map(cell => ({
              ...cell,
              state: factorPairs.has(`${cell.row}-${cell.col}`) ? 'hit' : cell.state as CellState
            }))
          );
          setGrid(revealedGrid);
        }, 500);
      }
    } else {
      // Miss!
      setCombo(0);
      recordAnswer('numeracy', false);
    }
  };

  const accuracy = totalShots > 0 ? Math.round((foundPairs.size / totalShots) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 pb-8">
      {/* Animated Water Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
        {/* Animated waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '100px',
              opacity: 0.1 - i * 0.03,
            }}
          >
            <Waves className="w-full h-full text-white" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 py-3">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" onClick={onBack} className="bg-white/90 backdrop-blur-sm hover:bg-white h-9 text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold">Chart</span>
            </motion.button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border-2 border-yellow-400">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Ship className="w-8 h-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl text-blue-600">
                  <TextWithVoice>Factor Battleship</TextWithVoice>
                </h1>
                <p className="text-xs text-gray-600">
                  <TextWithVoice>Find all factor pairs that equal the target!</TextWithVoice>
                </p>
              </div>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-5 gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Target className="w-4 h-4" />
                  <div className="text-xs font-semibold">Target</div>
                </div>
                <div className="text-2xl font-bold">{targetNumber}</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Anchor className="w-4 h-4" />
                  <div className="text-xs font-semibold">Found</div>
                </div>
                <div className="text-2xl font-bold">{foundPairs.size}/{factorPairs.size}</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Trophy className="w-4 h-4" />
                  <div className="text-xs font-semibold">Score</div>
                </div>
                <div className="text-2xl font-bold">{score}</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Target className="w-4 h-4" />
                  <div className="text-xs font-semibold">Shots</div>
                </div>
                <div className="text-2xl font-bold">{totalShots}</div>
              </motion.div>

              <motion.div 
                animate={combo > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Zap className="w-4 h-4" />
                  <div className="text-xs font-semibold">Combo</div>
                </div>
                <div className="text-2xl font-bold">{combo}x</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Multiplication Chart Modal */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowChart(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                  <TextWithVoice>Multiplication Chart</TextWithVoice>
                </h2>
                <img 
                  src={multiplicationChart} 
                  alt="Multiplication Chart" 
                  className="w-full rounded-lg shadow-lg"
                />
                <Button 
                  onClick={() => setShowChart(false)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Complete Modal */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl max-w-md w-full border-4 border-yellow-500"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}
                  className="text-center mb-4"
                >
                  <Trophy className="w-24 h-24 mx-auto text-white drop-shadow-lg" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
                  <TextWithVoice>All Ships Sunk! 🎉</TextWithVoice>
                </h2>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 space-y-3 mb-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-700">Final Score:</span>
                    <span className="text-2xl font-bold text-blue-600">{score}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-700">Accuracy:</span>
                    <span className="text-2xl font-bold text-green-600">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-700">Total Shots:</span>
                    <span className="text-2xl font-bold text-purple-600">{totalShots}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewGame}
                  className="w-full bg-white text-orange-600 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-lg"
                >
                  🚢 Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl"
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Column headers */}
              <div className="flex mb-1">
                <div className="w-8 h-8 flex-shrink-0" />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(col => (
                  <div 
                    key={`header-${col}`}
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-blue-600 text-xs mx-0.5"
                  >
                    {col}
                  </div>
                ))}
              </div>

              {/* Grid rows */}
              {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex mb-0.5">
                  {/* Row header */}
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-blue-600 text-xs">
                    {rowIndex + 1}
                  </div>
                  
                  {/* Cells */}
                  {row.map((cell, colIndex) => (
                    <motion.button
                      key={`cell-${rowIndex}-${colIndex}`}
                      whileHover={cell.state === 'water' ? { scale: 1.1, rotate: 5 } : {}}
                      whileTap={cell.state === 'water' ? { scale: 0.9 } : {}}
                      onClick={() => handleCellClick(cell.row, cell.col)}
                      disabled={cell.state !== 'water' || gameComplete}
                      className={`
                        w-8 h-8 flex-shrink-0 rounded-lg mx-0.5
                        flex items-center justify-center font-bold text-xs
                        transition-all duration-300 relative overflow-hidden
                        ${cell.state === 'water' ? 'bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 cursor-pointer shadow-md' : ''}
                        ${cell.state === 'hit' ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg' : ''}
                        ${cell.state === 'miss' ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : ''}
                      `}
                    >
                      {cell.state === 'water' && (
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random(),
                          }}
                          className="absolute inset-0 bg-white/20 rounded-lg"
                        />
                      )}
                      
                      {cell.state === 'hit' && (
                        <>
                          <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ duration: 0.5, type: "spring" }}
                          >
                            💥
                          </motion.div>
                          {lastHit?.row === cell.row && lastHit?.col === cell.col && (
                            <motion.div
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 3, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute inset-0 bg-orange-400 rounded-full"
                            />
                          )}
                        </>
                      )}
                      
                      {cell.state === 'miss' && (
                        <motion.div
                          initial={{ scale: 0, y: -20 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          💧
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Helper text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center text-gray-700 space-y-1"
          >
            <p className="text-xs">
              <TextWithVoice>
                Click cells where the row × column = {targetNumber}
              </TextWithVoice>
            </p>
            <p className="text-xs text-gray-500">
              <TextWithVoice>
                💥 = Hit (correct factor pair) • 💧 = Miss (incorrect)
              </TextWithVoice>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}