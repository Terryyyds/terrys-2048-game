import { FC } from 'react';
import { Game2048 } from './components/game-2048';

export const App: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
      <Game2048 />
      <div className="mt-16 text-center text-sm text-gray-600">
        <div>Made with 💔 by Terry Deng & Cursor</div>
        <div>A 2048 Game using React + TypeScript + Vite</div>
      </div>
    </div>
  );
};
