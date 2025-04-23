import { cn } from '@/utils/cn';
import { FC, useEffect, useState, useRef, useLayoutEffect, type TouchEvent } from 'react';
import { GameBoard } from './game-board';
import { GameHeader } from './game-header';
import { GameInstructions } from './game-instructions';
import { GameOverOverlay } from './game-over-overlay';
import { GameWonOverlay } from './game-won-overlay';
import { useGame2048 } from './use-game-2048';

// 根据设备宽度动态计算基础尺寸
const BASE_CELL_SIZE = 94; // 桌面端基础格子尺寸
const MIN_CELL_SIZE = 65; // 移动端最小格子尺寸
export const CELL_SIZE = Math.max(
  MIN_CELL_SIZE,
  Math.min(BASE_CELL_SIZE, Math.floor(window.innerWidth / 5)) // 确保至少有 1/5 屏幕宽度的边距
);
export const GAP_SIZE = Math.max(8, Math.floor(CELL_SIZE * 0.12)); // 间距随格子大小等比缩放
export const PADDING = Math.max(8, Math.floor(CELL_SIZE * 0.12)); // 内边距随格子大小等比缩放
export const BOARD_SIZE = CELL_SIZE * 4 + GAP_SIZE * 3 + PADDING * 2; // Total game board size

// Main Game Component
export const Game2048: FC<{ className?: string }> = ({ className }) => {
  const { tiles, score, gameOver: isGameOver, won: gameWon, move, reset: newGame } = useGame2048();
  // 移动端缩放与触摸滑动支持
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    scale: 1,
    cellSize: CELL_SIZE,
    gapSize: GAP_SIZE,
    padding: PADDING,
    boardSize: BOARD_SIZE,
  });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // 计算基础尺寸
  const calculateDimensions = () => {
    const cellSize = Math.max(
      MIN_CELL_SIZE,
      Math.min(BASE_CELL_SIZE, Math.floor(window.innerWidth / 5))
    );
    const gapSize = Math.max(8, Math.floor(cellSize * 0.12));
    const padding = Math.max(8, Math.floor(cellSize * 0.12));
    const boardSize = cellSize * 4 + gapSize * 3 + padding * 2;
    return { cellSize, gapSize, padding, boardSize };
  };

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const dims = calculateDimensions();
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          ...dims,
          scale: Math.min(1, width / dims.boardSize),
        });
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
        className="relative w-full"
        style={{
          maxWidth: `${dimensions.boardSize}px`,
          touchAction: 'none',
          overscrollBehavior: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: `${dimensions.boardSize * dimensions.scale}px`,
            height: `${dimensions.boardSize * dimensions.scale}px`,
            touchAction: 'none',
            overscrollBehavior: 'none',
          }}
        >
          <div
            className="origin-top-left"
            style={{
              width: `${dimensions.boardSize}px`,
              height: `${dimensions.boardSize}px`,
              transform: `scale(${dimensions.scale})`,
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
