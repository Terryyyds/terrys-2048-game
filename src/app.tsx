import { FC } from 'react';
import { Game2048 } from './components/game-2048';

export const App: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200">
      <Game2048 />
      <div className="mt-26 px-6 text-center text-xs text-gray-500">
        <div>2048 Game using React + TypeScript + Vite + Framer Motion</div>
        <div>Made by <a href="https://terrylog.cn" target="_blank">Yu Deng</a> & <a href="https://github.com/reekystive" target="_blank">Mingxuan Wang</a> & <a href="https://www.cursor.com" target="_blank">Cursor</a></div>
      </div>
    </div>
  );
};
