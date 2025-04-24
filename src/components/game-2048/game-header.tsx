import { cn } from '@/utils/cn';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import { NewGameButton } from './new-game-button.tsx';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onNewGameClick: () => void;
  className?: string;
}

export const GameHeader: FC<GameHeaderProps> = ({ score, bestScore, onNewGameClick, className }) => {
  const scoreMotion = useSpring(0, { stiffness: 100, damping: 30 });
  const displayScore = useTransform(scoreMotion, (value) => Math.round(value));
  const prevScore = useRef(score);
  const [scoreDiff, setScoreDiff] = useState(0);

  useEffect(() => {
    if (score > prevScore.current) {
      setScoreDiff(score - prevScore.current);
    }
    scoreMotion.set(score);
    prevScore.current = score;
  }, [score, scoreMotion]);

  return (
    <div className={cn('flex w-full justify-between', className)}>
      <div className={cn('relative flex flex-col items-center rounded-lg bg-gray-200 px-4 py-2 w-[100px]')}>
        <div className={cn('text-sm text-black')}>Score</div>
        <motion.div className={cn('text-xl font-bold text-black')}>{displayScore}</motion.div>
        <AnimatePresence>
          {scoreDiff > 0 && (
            <motion.div
              key={score}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              className={cn('absolute -top-2 text-sm font-bold text-green-600')}
              onAnimationComplete={() => setScoreDiff(0)}
            >
              +{scoreDiff}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <NewGameButton onClick={onNewGameClick} className={'h-[60px] flex items-center'} />
      <div className={cn('flex flex-col items-center rounded-lg bg-gray-200 px-4 py-2 w-[100px]')}>
        <div className={cn('text-sm text-black')}>Best</div>
        <div className={cn('text-xl font-bold text-black')}>{bestScore}</div>
      </div>
    </div>
  );
};
