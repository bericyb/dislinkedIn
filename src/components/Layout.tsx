import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import GridBlocks from './GridBlocks';

interface AnimatedLine {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color: 'primary' | 'secondary';
  opacity: number;
  duration: number;
  delay: number;
  repeatDelay: number;
  length: number;
}

export default function Layout() {
  const [lines, setLines] = useState<AnimatedLine[]>([]);

  useEffect(() => {
    const generateRandomLines = () => {
      const GRID_SIZE = 40;
      const newLines: AnimatedLine[] = [];
      const lineCount = Math.floor(Math.random() * 8) + 6;

      for (let i = 0; i < lineCount; i++) {
        const isHorizontal = Math.random() > 0.5;
        const maxDimension = isHorizontal ? window.innerHeight : window.innerWidth;
        const maxGridCells = Math.floor(maxDimension / GRID_SIZE);
        const gridCell = Math.floor(Math.random() * (maxGridCells - 2)) + 1;

        const line: AnimatedLine = {
          id: `line-${i}`,
          type: isHorizontal ? 'horizontal' : 'vertical',
          position: gridCell * GRID_SIZE,
          color: Math.random() > 0.5 ? 'primary' : 'secondary',
          opacity: Math.random() * 0.3 + 0.15,
          duration: Math.random() * 4 + 4,
          delay: Math.random() * 5,
          repeatDelay: Math.random() * 5 + 3,
          length: Math.random() * 200 + 150,
        };
        newLines.push(line);
      }

      setLines(newLines);
    };

    generateRandomLines();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
      {/* Grid Background - Fixed to viewport */}
      <div className="fixed inset-0 grid-pattern" />

      {/* Diagonal Dithering Overlays - Fixed to viewport */}
      <div className="fixed inset-0 diagonal-dither opacity-30" />
      <div className="fixed top-0 right-0 w-1/3 h-full diagonal-dither-reverse opacity-20" />

      {/* Grid-Aligned Shaded Blocks */}
      <GridBlocks />

      {/* Randomly Generated Animated Lines - Fixed positioning */}
      {lines.map((line) => {
        const color = line.color === 'primary'
          ? 'hsl(var(--primary))'
          : 'hsl(var(--secondary))';

        if (line.type === 'horizontal') {
          return (
            <motion.div
              key={line.id}
              className="fixed h-px"
              style={{
                top: line.position,
                width: `${line.length}px`,
                background: `linear-gradient(to right, transparent, ${color})`,
                opacity: line.opacity,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100vw' }}
              transition={{
                duration: line.duration,
                delay: line.delay,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: line.repeatDelay,
                ease: "linear"
              }}
            />
          );
        } else {
          return (
            <motion.div
              key={line.id}
              className="fixed w-px"
              style={{
                left: line.position,
                height: `${line.length}px`,
                background: `linear-gradient(to bottom, transparent, ${color})`,
                opacity: line.opacity,
              }}
              initial={{ y: '-100%' }}
              animate={{ y: '100vh' }}
              transition={{
                duration: line.duration,
                delay: line.delay,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: line.repeatDelay,
                ease: "linear"
              }}
            />
          );
        }
      })}

      {/* Main Content Area */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Corner Dithering Details - Fixed to viewport */}
      <div className="fixed top-0 left-0 w-40 h-40 diagonal-dither opacity-15" />
      <div className="fixed bottom-0 right-0 w-32 h-32 diagonal-dither-reverse opacity-10" />
    </div>
  );
}
