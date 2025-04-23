import { cn } from '@/utils/cn';
import { FC, useEffect, useState, useRef, useLayoutEffect, type TouchEvent } from 'react';
import { GameBoard } from './game-board';
import { GameHeader } from './game-header';
import { GameInstructions } from './game-instructions';
import { GameOverOverlay } from './game-over-overlay';
import { GameWonOverlay } from './game-won-overlay';
import { useGame2048 } from './use-game-2048';

// Game constants - referenced in multiple components
export const CELL_SIZE = 94; // Cell size
export const GAP_SIZE = 12; // Gap between cells
export const PADDING = 12; // Container padding
export const BOARD_SIZE = CELL_SIZE * 4 + GAP_SIZE * 3 + PADDING * 2; // Total game board size

// Main Game Component
export const Game2048: FC<{ className?: string }> = ({ className }) => {
  const { tiles, score, gameOver: isGameOver, won: gameWon, move, reset: newGame } = useGame2048();
  // 移动端缩放与触摸滑动支持
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // 根据屏幕宽度设置不同的缩放比例
        if (window.innerWidth < 350) {
          setScale(0.5); // 超小屏幕缩放为50%
        } else if (window.innerWidth < 450) {
          setScale(0.75);
        } else {
          setScale(Math.min(1, width / BOARD_SIZE));
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 30;
    if (Math.max(absDx, absDy) > threshold) {
      if (absDx > absDy) {
        dx > 0 ? move('right') : move('left');
      } else {
        dy > 0 ? move('down') : move('up');
      }
    }
    touchStart.current = null;
  };

  // Get best score from local storage
  const bestScore = localStorage.getItem('2048_best_score') ? Number(localStorage.getItem('2048_best_score')) : 0;

  // Update best score if current score is higher
  if (score > bestScore) {
    localStorage.setItem('2048_best_score', String(score));
  }

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          move('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [move]);

  return (
    <div className={cn('isolate flex flex-col items-center gap-4', className)}>
      <GameHeader score={score} bestScore={bestScore} onNewGameClick={newGame} className="mb-16" />
      <div
        ref={containerRef}
        className="relative w-full flex justify-center"
        style={{
          maxWidth: `${BOARD_SIZE}px`,
          touchAction: 'none',
          overscrollBehavior: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative overflow-hidden mx-auto"
          style={{
            width: `${BOARD_SIZE * scale}px`,
            height: `${BOARD_SIZE * scale}px`,
            touchAction: 'none',
            overscrollBehavior: 'none',
          }}
        >
          <div
            className="origin-top-left"
            style={{
              width: `${BOARD_SIZE}px`,
              height: `${BOARD_SIZE}px`,
              transform: `scale(${scale})`,
            }}
          >
            <GameBoard tiles={tiles} />
            <GameOverOverlay isVisible={isGameOver} onNewGame={newGame} />
            <GameWonOverlay isVisible={gameWon && !isGameOver} onNewGame={newGame} />
          </div>
        </div>
      </div>
      <GameInstructions />
    </div>
  );
};
