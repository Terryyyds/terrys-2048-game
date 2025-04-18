import { cn } from '@/utils/cn';
import { FC } from 'react';

interface NewGameButtonProps {
  onClick: () => void;
  className?: string;
}

export const NewGameButton: FC<NewGameButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn('rounded-lg bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-600', className)}
    >
      New Game
    </button>
  );
};
