import { useState, useEffect } from 'react';

interface GridBlock {
  id: string;
  x: number; // Grid cell x position
  y: number; // Grid cell y position
  width: number; // Width in grid cells
  height: number; // Height in grid cells
  patternDirection: 'forward' | 'reverse'; // 45deg or -45deg
  opacity: number;
}

export default function GridBlocks() {
  const [blocks, setBlocks] = useState<GridBlock[]>([]);

  useEffect(() => {
    const generateBlocks = () => {
      const GRID_SIZE = 40; // Match the grid pattern size
      const newBlocks: GridBlock[] = [];
      const blockCount = Math.floor(Math.random() * 5) + 4; // 4-8 blocks

      // Calculate available grid cells - use viewport dimensions since blocks are fixed
      const maxGridX = Math.floor(window.innerWidth / GRID_SIZE);
      const maxGridY = Math.floor(window.innerHeight / GRID_SIZE);

      for (let i = 0; i < blockCount; i++) {
        // Block sizes in grid cells
        const possibleSizes = [
          { width: 2, height: 2 },
          { width: 3, height: 2 },
          { width: 2, height: 3 },
          { width: 4, height: 3 },
          { width: 3, height: 3 },
          { width: 4, height: 2 },
        ];

        const size = possibleSizes[Math.floor(Math.random() * possibleSizes.length)];

        // Random position ensuring block fits within viewport
        const x = Math.floor(Math.random() * (maxGridX - size.width));
        const y = Math.floor(Math.random() * (maxGridY - size.height));

        const block: GridBlock = {
          id: `block-${i}`,
          x,
          y,
          width: size.width,
          height: size.height,
          patternDirection: Math.random() > 0.5 ? 'forward' : 'reverse',
          opacity: Math.random() * 0.3 + 0.4, // 0.4 to 0.7
        };

        newBlocks.push(block);
      }

      setBlocks(newBlocks);
    };

    generateBlocks();
  }, []);

  return (
    <>
      {blocks.map((block) => {
        const GRID_SIZE = 40;
        return (
          <div
            key={block.id}
            className={`fixed ${
              block.patternDirection === 'forward'
                ? 'diagonal-gray-dither'
                : 'diagonal-gray-dither-reverse'
            }`}
            style={{
              left: `${block.x * GRID_SIZE}px`,
              top: `${block.y * GRID_SIZE}px`,
              width: `${block.width * GRID_SIZE}px`,
              height: `${block.height * GRID_SIZE}px`,
              opacity: block.opacity,
            }}
          />
        );
      })}
    </>
  );
}
