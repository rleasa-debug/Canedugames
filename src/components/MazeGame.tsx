import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, ChevronRight } from 'lucide-react';
import { TextWithVoice } from './TextWithVoice';

interface MazeGameProps {
  onBack: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Maze {
  level: number;
  walls: Path2D;
  start: Point;
  end: Point;
  endRadius: number;
  wallThickness: number;
}

export function MazeGame({ onBack }: MazeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [mazeCompleted, setMazeCompleted] = useState(false);
  const [totalStars, setTotalStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Generate mazes with increasing difficulty
  const generateMaze = (level: number): Maze => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return {
        level,
        walls: new Path2D(),
        start: { x: 50, y: 150 },
        end: { x: 350, y: 150 },
        endRadius: 20,
        wallThickness: 40
      };
    }

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const walls = new Path2D();

    // Progressive difficulty: narrower paths and more complex layouts
    const wallThickness = Math.max(50 - level * 4, 18); // Much narrower progression
    const endRadius = Math.max(28 - level * 2, 15); // Smaller target as levels increase

    if (level === 1) {
      // Level 1: Zigzag path - moderately challenging start
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, 120);
      walls.rect(width - 75, 180, 25, 120);
      
      // Zigzag barriers
      walls.rect(150, 150, 200, 25);
      walls.rect(200, 225, 200, 25);
      
      return {
        level,
        walls,
        start: { x: 80, y: 110 },
        end: { x: width - 80, y: height - 110 },
        endRadius,
        wallThickness
      };
    } else if (level === 2) {
      // Level 2: S-curve with tight turns
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, 160);
      walls.rect(width - 75, 165, 25, 160);
      
      // S-curve obstacles
      walls.rect(150, centerY - 15, 250, 30);
      walls.rect(200, 140, 30, 80);
      walls.rect(350, 240, 30, 80);
      
      return {
        level,
        walls,
        start: { x: 80, y: 120 },
        end: { x: width - 80, y: height - 120 },
        endRadius,
        wallThickness
      };
    } else if (level === 3) {
      // Level 3: Circular maze
      const radius = 115;
      
      // Outer circle
      walls.arc(centerX, centerY, radius + 28, 0, Math.PI * 2);
      walls.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      
      // Inner circle
      walls.arc(centerX, centerY, 55, 0, Math.PI * 2);
      walls.arc(centerX, centerY, 27, 0, Math.PI * 2, true);
      
      // Strategic barriers
      walls.rect(centerX - 4, centerY - radius - 28, 8, 35);
      walls.rect(centerX - 4, centerY + radius - 7, 8, 35);
      walls.rect(centerX + 75, centerY - 4, 35, 8);
      walls.rect(centerX - 110, centerY - 4, 35, 8);
      
      return {
        level,
        walls,
        start: { x: centerX - radius - 14, y: centerY },
        end: { x: centerX, y: centerY },
        endRadius,
        wallThickness
      };
    } else if (level === 4) {
      // Level 4: Double zigzag pattern
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      
      for (let i = 0; i < 5; i++) {
        const y = 110 + i * 55;
        if (i % 2 === 0) {
          walls.rect(50, y, width - 180, 25);
        } else {
          walls.rect(130, y, width - 180, 25);
        }
      }
      
      return {
        level,
        walls,
        start: { x: 80, y: 88 },
        end: { x: width - 80, y: height - 88 },
        endRadius,
        wallThickness
      };
    } else if (level === 5) {
      // Level 5: Spiral maze
      const spiralRadius = 140;
      
      // Outer boundary
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, height - 100);
      walls.rect(width - 75, 50, 25, height - 100);
      
      // Spiral walls
      walls.rect(130, 130, width - 260, 25);
      walls.rect(130, 130, 25, height - 260);
      walls.rect(210, 210, width - 420, 25);
      walls.rect(width - 235, 210, 25, height - 340);
      
      return {
        level,
        walls,
        start: { x: 100, y: 88 },
        end: { x: centerX, y: centerY },
        endRadius,
        wallThickness
      };
    } else if (level === 6) {
      // Level 6: Multi-chamber maze
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, height - 100);
      walls.rect(width - 75, 50, 25, height - 100);
      
      // Vertical dividers with gaps
      walls.rect(centerX - 80, 75, 25, 130);
      walls.rect(centerX - 80, 240, 25, 85);
      walls.rect(centerX + 55, 75, 25, 85);
      walls.rect(centerX + 55, 195, 25, 130);
      
      // Horizontal dividers
      walls.rect(130, centerY - 12, 120, 25);
      walls.rect(330, centerY - 12, 120, 25);
      
      return {
        level,
        walls,
        start: { x: 88, y: centerY },
        end: { x: width - 88, y: centerY },
        endRadius,
        wallThickness
      };
    } else if (level === 7) {
      // Level 7: Complex serpentine
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, height - 100);
      walls.rect(width - 75, 50, 25, height - 100);
      
      // Serpentine barriers
      for (let i = 0; i < 4; i++) {
        const y = 110 + i * 65;
        const offset = i % 2 === 0 ? 0 : 80;
        walls.rect(130 + offset, y, width - 340 - offset, 25);
      }
      
      return {
        level,
        walls,
        start: { x: 88, y: 88 },
        end: { x: width - 88, y: height - 88 },
        endRadius,
        wallThickness
      };
    } else if (level === 8) {
      // Level 8: Double spiral
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, height - 100);
      walls.rect(width - 75, 50, 25, height - 100);
      
      // Left spiral
      walls.rect(130, 130, 150, 25);
      walls.rect(130, 130, 25, 140);
      walls.rect(205, 205, 75, 25);
      
      // Right spiral
      walls.rect(width - 280, 240, 150, 25);
      walls.rect(width - 155, 155, 25, 85);
      walls.rect(width - 355, 155, 75, 25);
      
      return {
        level,
        walls,
        start: { x: 88, y: centerY },
        end: { x: width - 88, y: centerY },
        endRadius,
        wallThickness
      };
    } else if (level === 9) {
      // Level 9: Labyrinth
      walls.rect(50, 50, width - 100, 25);
      walls.rect(50, height - 75, width - 100, 25);
      walls.rect(50, 50, 25, height - 100);
      walls.rect(width - 75, 50, 25, height - 100);
      
      // Complex internal structure
      const cellSize = 60;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          if ((row + col) % 3 !== 0) {
            const x = 100 + col * cellSize;
            const y = 100 + row * cellSize;
            if (Math.random() > 0.3) {
              walls.rect(x, y, cellSize * 0.6, 20);
            }
          }
        }
      }
      
      return {
        level,
        walls,
        start: { x: 88, y: 88 },
        end: { x: width - 88, y: height - 88 },
        endRadius,
        wallThickness
      };
    } else {
      // Level 10: Master maze - ultimate challenge
      walls.rect(50, 50, width - 100, 20);
      walls.rect(50, height - 70, width - 100, 20);
      walls.rect(50, 50, 20, height - 100);
      walls.rect(width - 70, 50, 20, height - 100);
      
      // Dense maze pattern
      const divisions = 7;
      for (let i = 1; i < divisions; i++) {
        const x = 100 + (i * (width - 200) / divisions);
        const skipTop = i % 2 === 0;
        const skipBottom = i % 2 === 1;
        
        if (!skipTop) {
          walls.rect(x - 10, 90, 20, 120);
        }
        if (!skipBottom) {
          walls.rect(x - 10, 230, 20, 120);
        }
      }
      
      // Horizontal dividers
      walls.rect(130, centerY - 10, 150, 20);
      walls.rect(width - 280, centerY - 10, 150, 20);
      
      return {
        level,
        walls,
        start: { x: 88, y: centerY },
        end: { x: width - 88, y: centerY },
        endRadius: 15,
        wallThickness: 18
      };
    }
  };

  const [currentMaze, setCurrentMaze] = useState<Maze | null>(null);

  // Initialize maze when level changes
  useEffect(() => {
    if (canvasRef.current) {
      const maze = generateMaze(currentLevel);
      setCurrentMaze(maze);
      drawMaze(maze);
    }
  }, [currentLevel]);

  const drawMaze = (maze: Maze) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#eff6ff');
    gradient.addColorStop(1, '#dbeafe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw walls with shadow
    ctx.shadowColor = 'rgba(30, 64, 175, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const wallGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    wallGradient.addColorStop(0, '#1e40af');
    wallGradient.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = wallGradient;
    ctx.fill(maze.walls);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw start point (green) with glow
    ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
    ctx.shadowBlur = 15;
    
    const startGradient = ctx.createRadialGradient(maze.start.x, maze.start.y, 5, maze.start.x, maze.start.y, 18);
    startGradient.addColorStop(0, '#4ade80');
    startGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = startGradient;
    ctx.beginPath();
    ctx.arc(maze.start.x, maze.start.y, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Start point border
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', maze.start.x, maze.start.y);

    // Draw end point (gold star) with glow
    ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
    ctx.shadowBlur = 20;
    
    const endGradient = ctx.createRadialGradient(maze.end.x, maze.end.y, 0, maze.end.x, maze.end.y, maze.endRadius);
    endGradient.addColorStop(0, '#fde047');
    endGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = endGradient;
    ctx.beginPath();
    ctx.arc(maze.end.x, maze.end.y, maze.endRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // End point border
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw star
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', maze.end.x, maze.end.y);

    // Draw user's path with gradient
    if (pathPoints.length > 0) {
      const pathGradient = ctx.createLinearGradient(
        pathPoints[0].x, 
        pathPoints[0].y, 
        pathPoints[pathPoints.length - 1].x, 
        pathPoints[pathPoints.length - 1].y
      );
      pathGradient.addColorStop(0, '#ef4444');
      pathGradient.addColorStop(1, '#dc2626');
      
      ctx.strokeStyle = pathGradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      pathPoints.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const checkCollision = (point: Point): boolean => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !currentMaze) return false;

    return ctx.isPointInPath(currentMaze.walls, point.x, point.y);
  };

  const checkWin = (point: Point): boolean => {
    if (!currentMaze) return false;
    const dx = point.x - currentMaze.end.x;
    const dy = point.y - currentMaze.end.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= currentMaze.endRadius;
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getMousePos(e);
    
    if (!currentMaze) return;

    // Check if starting near the start point
    const dx = pos.x - currentMaze.start.x;
    const dy = pos.y - currentMaze.start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 30) {
      setIsDrawing(true);
      setGameState('playing');
      setPathPoints([pos]);
      setMazeCompleted(false);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || gameState !== 'playing') return;

    const pos = getMousePos(e);

    // Check for collision
    if (checkCollision(pos)) {
      setIsDrawing(false);
      setGameState('lost');
      return;
    }

    // Check for win
    if (checkWin(pos)) {
      setIsDrawing(false);
      setGameState('won');
      setMazeCompleted(true);
      setTotalStars(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      return;
    }

    setPathPoints(prev => [...prev, pos]);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const resetMaze = () => {
    setPathPoints([]);
    setGameState('playing');
    setMazeCompleted(false);
    if (currentMaze) {
      drawMaze(currentMaze);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setPathPoints([]);
    setGameState('playing');
    setMazeCompleted(false);
  };

  // Redraw canvas whenever pathPoints change
  useEffect(() => {
    if (currentMaze) {
      drawMaze(currentMaze);
    }
  }, [pathPoints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
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
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-semibold">{totalStars} Stars</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl mb-2">
              <TextWithVoice>Maze Navigator in Nunavut</TextWithVoice>
            </h1>
            <p className="text-gray-600">
              <TextWithVoice>Draw your path from START to the ★ without touching the walls!</TextWithVoice>
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Level {currentLevel}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6"
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              className="w-full border-4 border-blue-300 rounded-2xl cursor-crosshair touch-none shadow-inner bg-gradient-to-br from-blue-50 to-indigo-50"
              style={{ maxWidth: '100%', height: 'auto' }}
            />

            {/* Celebration overlay */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-2xl shadow-2xl text-2xl font-bold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-8 h-8" />
                      <span>Amazing!</span>
                      <Sparkles className="w-8 h-8" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
            <p><TextWithVoice>🖱️ Click and drag from START or 👆 Touch and drag on mobile</TextWithVoice></p>
            {gameState === 'lost' && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 font-semibold"
              >
                <TextWithVoice>Oops! You hit a wall. Try again!</TextWithVoice>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={resetMaze}
            variant="outline"
            size="lg"
            className="bg-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Maze
          </Button>

          {mazeCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={nextLevel}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
              >
                Next Level
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center"
        >
          <p className="text-purple-800">
            <TextWithVoice>💡 Tip: Move slowly and carefully for better control!</TextWithVoice>
          </p>
        </motion.div>
      </div>
    </div>
  );
}