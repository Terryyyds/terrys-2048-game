import { cn } from '@/utils/cn';
import { motion, useWillChange } from 'framer-motion';
import { FC } from 'react';

interface GameOverOverlayProps {
  isVisible: boolean;
  onNewGame: () => void;
}

export const GameOverOverlay: FC<GameOverOverlayProps> = ({ isVisible, onNewGame }) => {
  // 使用willChange属性优化动画性能
  const willChange = useWillChange();
  
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{
        duration: 0.3,
        // 支持高刷新率设备
        syncDriver: true
      }}
      style={{ willChange }}
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-gray-800 text-white'
      )}
    >
      <div className={cn('text-3xl font-bold')}>Game Over!</div>
      <button onClick={onNewGame} className={cn('mt-4 rounded-lg bg-pink-500 px-4 py-2 font-bold hover:bg-pink-600')}>
        Play Again
      </button>
    </motion.div>
  );
};
