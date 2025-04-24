import { cn } from '@/utils/cn';
import { FC } from 'react';

export const GameInstructions: FC = () => {
  return (
    <div className={cn('mt-6 px-6 text-center text-sm text-gray-600')}>
      Use Arrow Keys, WASD or Swipe to move tiles. <br></br> Tiles with the same number merge when they touch.
    </div>
  );
};