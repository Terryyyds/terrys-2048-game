import { cn } from '@/utils/cn';
import { FC } from 'react';
import { Tile } from './tile';
import { TileWithPosition } from './use-game-2048';

// Game constants - Keep in sync with Tile component
const CELL_SIZE = 94; // Cell size
const GAP_SIZE = 12; // Gap between cells
const PADDING = 12; // Container padding
const BOARD_SIZE = CELL_SIZE * 4 + GAP_SIZE * 3 + PADDING * 2; // Total game board size

interface GameBoardProps {
  tiles: TileWithPosition[];
}

export const GameBoard: FC<GameBoardProps> = ({ tiles }) => {
  return (
    <div
      className={cn('relative rounded-lg bg-gray-300 p-3')}
      style={{
        width: `${BOARD_SIZE}px`,
        height: `${BOARD_SIZE}px`,
      }}
    >
      {/* Static background grid */}
      <div className={cn('grid grid-cols-4 grid-rows-4 gap-3')}>
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={`cell-${index}`}
            className={cn('rounded-lg bg-gray-200')}
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
            }}
          />
        ))}
      </div>

      {/* Dynamic tiles container with absolute positioning */}
      <div className={cn('absolute inset-0 p-3')}>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            value={tile.value}
            row={tile.row}
            col={tile.col}
            isNew={tile.isNew}
            previousPosition={tile.previousPosition}
          />
        ))}
      </div>
    </div>
  );
};
