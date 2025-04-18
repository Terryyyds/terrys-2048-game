import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Direction = 'up' | 'down' | 'left' | 'right';
export interface Tile {
  value: number;
  id: string;
}
export type Board = (Tile | null)[][];

export interface TileWithPosition extends Tile {
  row: number;
  col: number;
  isNew: boolean;
  previousPosition?: {
    row: number;
    col: number;
  };
}

// Create an empty 4x4 board
const createEmptyBoard = (): Board => {
  const board = Array<Tile[] | null>(4)
    .fill(null)
    .map(() => Array<Tile | null>(4).fill(null));
  return board;
};

// Add a new tile (2 or 4) to a random empty cell
const addRandomTile = (board: Board): { board: Board; newTile: { row: number; col: number; id: string } | null } => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  const emptyPositions: { row: number; col: number }[] = [];

  // Find all empty cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (newBoard[row]?.[col] === null) {
        emptyPositions.push({ row, col });
      }
    }
  }

  if (emptyPositions.length === 0) return { board: newBoard, newTile: null };

  // Randomly select an empty position
  const pos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  if (!pos) return { board: newBoard, newTile: null };

  // 90% chance to generate 2, 10% chance to generate 4
  const value = Math.random() < 0.9 ? 2 : 4;
  const id = uuidv4();

  if (newBoard[pos.row]) {
    const row = newBoard[pos.row];
    if (row) {
      row[pos.col] = {
        value,
        id,
      };
    } else {
      const tile = newBoard[pos.row];
      if (tile) {
        tile[pos.col] = {
          value,
          id,
        };
      }
    }
  }

  return {
    board: newBoard,
    newTile: {
      row: pos.row,
      col: pos.col,
      id,
    },
  };
};

// Convert board to a flat array of tiles (for rendering)
const boardToTiles = (
  board: Board,
  newTilePosition: { row: number; col: number; id: string } | null,
  previousPositions: Map<string, { row: number; col: number }>
): TileWithPosition[] => {
  const tiles: TileWithPosition[] = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tile = board[row]?.[col];
      if (tile) {
        const isNew = newTilePosition?.id === tile.id;
        const previousPosition = previousPositions.get(tile.id);

        tiles.push({
          ...tile,
          row,
          col,
          isNew,
          previousPosition,
        });
      }
    }
  }

  return tiles;
};

export const useGame2048 = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [tiles, setTiles] = useState<TileWithPosition[]>([]);
  const [newTilePosition, setNewTilePosition] = useState<{ row: number; col: number; id: string } | null>(null);
  const [previousPositions, setPreviousPositions] = useState<Map<string, { row: number; col: number }>>(new Map());

  // Update tile position history
  const updatePreviousPositions = useCallback((currentBoard: Board) => {
    const positions = new Map<string, { row: number; col: number }>();

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = currentBoard[row]?.[col];
        if (tile) {
          positions.set(tile.id, { row, col });
        }
      }
    }

    return positions;
  }, []);

  // Update tiles array
  useEffect(() => {
    const newTiles = boardToTiles(board, newTilePosition, previousPositions);
    setTiles(newTiles);

    // Reset new tile flag, it's only valid for one render cycle
    setNewTilePosition(null);
  }, [board, newTilePosition, previousPositions]);

  // Reset game
  const resetGame = useCallback(() => {
    let newBoard = createEmptyBoard();

    // Add first tile
    const result1 = addRandomTile(newBoard);
    newBoard = result1.board;

    // Add second tile
    const result2 = addRandomTile(newBoard);
    newBoard = result2.board;

    // Save new tile position
    setNewTilePosition(result2.newTile);

    setBoard(newBoard);
    setPreviousPositions(new Map());
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Check if there are any possible moves left
  const hasMovesLeft = useCallback((currentBoard: Board): boolean => {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row]?.[col] === null) {
          return true;
        }
      }
    }

    // Check for adjacent cells with the same value
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = currentBoard[row]?.[col];
        if (!tile) continue;

        // Check right
        const rightTile = currentBoard[row]?.[col + 1];
        if (col < 3 && rightTile && tile.value === rightTile.value) {
          return true;
        }

        // Check down
        const downTile = currentBoard[row + 1]?.[col];
        if (row < 3 && downTile && tile.value === downTile.value) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Move and merge logic
  const move = useCallback(
    (direction: Direction) => {
      if (gameOver) return;

      // Save current tile positions for animation
      const positions = updatePreviousPositions(board);

      const newBoard = JSON.parse(JSON.stringify(board)) as Board;
      let moved = false;
      let newScore = score;

      const moveRow = (row: number, reverse = false): boolean => {
        const originalRow = [...(newBoard[row] ?? [])];
        // Remove empty cells
        const rowTiles = originalRow.filter((tile): tile is Tile => tile !== null);

        // Merge adjacent tiles with the same value
        const mergedTiles: Tile[] = [];
        let i = 0;
        while (i < rowTiles.length - 1) {
          const currentTile = rowTiles[i];
          const nextTile = rowTiles[i + 1];

          if (currentTile && nextTile && currentTile.value === nextTile.value) {
            // Merge and add score
            const mergedValue = currentTile.value * 2;
            // Create new merged tile (keeping the first tile's ID)
            const mergedTile: Tile = {
              value: mergedValue,
              id: currentTile.id,
            };

            // Update current position tile
            rowTiles[i] = mergedTile;
            // Record merged tile
            mergedTiles.push(mergedTile);
            // Remove next tile (will be filtered out later)
            rowTiles.splice(i + 1, 1);

            // Update score
            newScore += mergedValue;

            // Check if won the game
            if (mergedValue === 2048 && !won) {
              setWon(true);
            }
          } else {
            // No merge, move to next tile
            i++;
          }
        }

        // Fill remaining spaces with null
        const result = Array(4).fill(null);
        if (reverse) {
          // Right align
          for (let i = 0; i < rowTiles.length; i++) {
            result[4 - rowTiles.length + i] = rowTiles[i];
          }
        } else {
          // Left align
          for (let i = 0; i < rowTiles.length; i++) {
            result[i] = rowTiles[i];
          }
        }

        if (newBoard[row]) {
          newBoard[row] = result as (Tile | null)[];
        }

        // Check if row changed
        const originalValues = originalRow.map((t) => t?.value);
        const newValues = result.map((t: Tile | null) => (t ? t.value : null));
        return JSON.stringify(originalValues) !== JSON.stringify(newValues);
      };

      const moveCol = (col: number, reverse = false): boolean => {
        // Extract column
        const originalCol = newBoard.map((row) => row[col]);
        // Remove empty cells
        const colTiles = originalCol.filter((tile): tile is Tile => tile !== null);

        // Merge adjacent tiles with the same value
        const mergedTiles: Tile[] = [];
        let i = 0;
        while (i < colTiles.length - 1) {
          const currentTile = colTiles[i];
          const nextTile = colTiles[i + 1];

          if (currentTile && nextTile && currentTile.value === nextTile.value) {
            // Merge and add score
            const mergedValue = currentTile.value * 2;
            // Create new merged tile (keeping the first tile's ID)
            const mergedTile: Tile = {
              value: mergedValue,
              id: currentTile.id,
            };

            // Update current position tile
            colTiles[i] = mergedTile;
            // Record merged tile
            mergedTiles.push(mergedTile);
            // Remove next tile (will be filtered out later)
            colTiles.splice(i + 1, 1);

            // Update score
            newScore += mergedValue;

            // Check if won the game
            if (mergedValue === 2048 && !won) {
              setWon(true);
            }
          } else {
            // No merge, move to next tile
            i++;
          }
        }

        // Fill remaining spaces with null
        const result = Array<Tile | null>(4).fill(null);
        if (reverse) {
          // Bottom align
          for (let i = 0; i < colTiles.length; i++) {
            result[4 - colTiles.length + i] = colTiles[i] ?? null;
          }
        } else {
          // Top align
          for (let i = 0; i < colTiles.length; i++) {
            result[i] = colTiles[i] ?? null;
          }
        }

        // Update column
        for (let row = 0; row < 4; row++) {
          const boardRow = newBoard[row];
          if (boardRow) {
            boardRow[col] = result[row] ?? null;
          }
        }

        // Check if column changed
        const originalValues = originalCol.map((t) => t?.value);
        const newValues = result.map((t: Tile | null) => (t ? t.value : null));
        return JSON.stringify(originalValues) !== JSON.stringify(newValues);
      };

      // Execute move based on direction
      switch (direction) {
        case 'up':
          for (let col = 0; col < 4; col++) {
            if (moveCol(col, false)) {
              moved = true;
            }
          }
          break;
        case 'down':
          for (let col = 0; col < 4; col++) {
            if (moveCol(col, true)) {
              moved = true;
            }
          }
          break;
        case 'left':
          for (let row = 0; row < 4; row++) {
            if (moveRow(row, false)) {
              moved = true;
            }
          }
          break;
        case 'right':
          for (let row = 0; row < 4; row++) {
            if (moveRow(row, true)) {
              moved = true;
            }
          }
          break;
      }

      // If there was a move, add a new random tile
      if (moved) {
        // Save current positions for animation
        setPreviousPositions(positions);

        // Add new tile and update board
        const { board: updatedBoard, newTile } = addRandomTile(newBoard);
        setBoard(updatedBoard);
        setNewTilePosition(newTile);
        setScore(newScore);

        // Check if game is over
        if (!hasMovesLeft(updatedBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, gameOver, hasMovesLeft, score, updatePreviousPositions, won]
  );

  return {
    board,
    tiles,
    score,
    gameOver,
    won,
    move,
    reset: resetGame,
  };
};
