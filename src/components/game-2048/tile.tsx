import { cn } from '@/utils/cn';
import { motion, useWillChange } from 'framer-motion';
import { FC } from 'react';

// Position type
export interface Position {
  row: number;
  col: number;
}

// Tile props
export interface TileProps {
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  previousPosition?: Position;
}

// Background color mapping
const bgColorMap: Record<number, string> = {
  2: 'bg-stone-100',
  4: 'bg-stone-200',
  8: 'bg-orange-300',
  16: 'bg-orange-400',
  32: 'bg-orange-500',
  64: 'bg-orange-600',
  128: 'bg-yellow-300',
  256: 'bg-yellow-400',
  512: 'bg-yellow-500',
  1024: 'bg-yellow-600',
  2048: 'bg-yellow-700',
};

// Text color mapping
const textColorMap: Record<number, string> = {
  2: 'text-stone-800',
  4: 'text-stone-800',
  8: 'text-white',
  16: 'text-white',
  32: 'text-white',
  64: 'text-white',
  128: 'text-white',
  256: 'text-white',
  512: 'text-white',
  1024: 'text-white',
  2048: 'text-white',
};

// Font size mapping
const fontSizeMap: Record<number, string> = {
  2: 'text-4xl',
  4: 'text-4xl',
  8: 'text-4xl',
  16: 'text-4xl',
  32: 'text-4xl',
  64: 'text-4xl',
  128: 'text-3xl',
  256: 'text-3xl',
  512: 'text-3xl',
  1024: 'text-2xl',
  2048: 'text-2xl',
};

// Game constants
const CELL_SIZE = 94; // Cell size
const GAP_SIZE = 12; // Gap between cells
const PADDING = 12; // Container padding

// Calculate tile position (pixel values)
const calculatePosition = (row: number, col: number): { top: number; left: number } => {
  const top = PADDING + row * (CELL_SIZE + GAP_SIZE);
  const left = PADDING + col * (CELL_SIZE + GAP_SIZE);
  return { top, left };
};

export const Tile: FC<TileProps> = ({ value, row, col, isNew, previousPosition }) => {
  // Get background color, text color and font size, use default values if no match
  const bgColor = bgColorMap[value] ?? 'bg-stone-100';
  const textColor = textColorMap[value] ?? 'text-stone-800';
  const fontSize = fontSizeMap[value] ?? 'text-4xl';
  
  // 使用willChange属性优化动画性能
  const willChange = useWillChange();

  // Calculate current position and previous position (raw numbers without px unit)
  const currentPosition = calculatePosition(row, col);
  const prevPosition = previousPosition
    ? calculatePosition(previousPosition.row, previousPosition.col)
    : currentPosition;

  return (
    <motion.div
      className={cn('absolute flex items-center justify-center rounded-lg font-bold', bgColor, textColor, fontSize)}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        willChange,
      }}
      initial={{
        top: prevPosition.top,
        left: prevPosition.left,
        scale: isNew ? 0 : 1,
        zIndex: isNew ? 10 : 1,
      }}
      animate={{
        top: currentPosition.top,
        left: currentPosition.left,
        scale: 1,
        zIndex: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.15,
        // 设置为true以确保在高刷新率设备上动画更流畅
        // 通过与设备刷新率同步，而不是固定帧率
        syncDriver: true,
        // 对于支持120Hz的设备，降低阻尼以获得更流畅的动画效果
        // 仍然保持视觉效果一致
        restSpeed: 0.001,
        restDelta: 0.001,
      }}
    >
      {value}
    </motion.div>
  );
};
