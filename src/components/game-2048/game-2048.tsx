import { cn } from '@/utils/cn';
import { FC, useEffect } from 'react';
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
      <div className="relative">
        <GameBoard tiles={tiles} />
        <GameOverOverlay isVisible={isGameOver} onNewGame={newGame} />
        <GameWonOverlay isVisible={gameWon && !isGameOver} onNewGame={newGame} />
      </div>
      <GameInstructions />
    </div>
  );
};
