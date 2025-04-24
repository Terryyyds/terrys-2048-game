import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { FC } from 'react';

interface GameWonOverlayProps {
  isVisible: boolean;
  onNewGame: () => void;
}

export const GameWonOverlay: FC<GameWonOverlayProps> = ({ isVisible, onNewGame }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      className={cn('absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-green-700 text-white')}
    >
      <div className={cn('text-3xl font-bold')}>Congratulations!</div>
      <p className={cn('mt-2')}>You can continue playing or start a new game</p>
      <button onClick={onNewGame} className={cn('mt-4 rounded-lg bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600')}>
        New Game
      </button>
    </motion.div>
  );
};
