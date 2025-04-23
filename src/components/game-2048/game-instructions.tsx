import { cn } from '@/utils/cn';
import { FC } from 'react';

export const GameInstructions: FC = () => {
  return (
    <div className={cn('mt-4 px-6 text-center text-sm text-gray-600')}>
      Use arrow keys or WASD to move tiles; on mobile, swipe to move. Tiles with the same number merge when they touch.
    </div>
  );
};