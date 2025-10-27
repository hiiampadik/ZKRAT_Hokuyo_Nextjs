import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPool } from '../hooks/useAudioPool';
import './Interactive2.sass';

interface GridCell {
  id: number;
  imageName: string;
  isSwapped: boolean;
}

const Interactive2: React.FC = () => {
  const ROWS = 4;
  const COLS = 8;

  const [grid, setGrid] = useState<GridCell[]>([]);

  // Store prefetched images
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Use audio pool hook for sound playback
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.8 });

  // Initialize grid with images from folder A
  useEffect(() => {
    const initialGrid: GridCell[] = [];
    let id = 0;
    for (let row = 1; row <= ROWS; row++) {
      for (let col = 1; col <= COLS; col++) {
        initialGrid.push({
          id: id++,
          imageName: `row-${row}-column-${col}.jpg`,
          isSwapped: false,
        });
      }
    }
    setGrid(initialGrid);
  }, []);

  // Prefetch all images from both A and B folders
  useEffect(() => {
    const imagesToLoad: string[] = [];

    // Add all images from both A and B folders
    for (let row = 1; row <= ROWS; row++) {
      for (let col = 1; col <= COLS; col++) {
        const imageName = `row-${row}-column-${col}.jpg`;
        imagesToLoad.push(`/pages/2/A/${imageName}`);
        imagesToLoad.push(`/pages/2/B/${imageName}`);
      }
    }

  }, []);

  // Handle cell click - swap image and play sound
  const handleCellClick = useCallback((cellId: number) => {
    setGrid(prevGrid => {
      const cell = prevGrid.find(c => c.id === cellId);
      if (!cell) return prevGrid;

      // Only swap from A to B, not back
      if (cell.isSwapped) {
        return prevGrid;
      }

      // Create new grid with swapped image
      const newGrid = prevGrid.map(c =>
        c.id === cellId ? { ...c, isSwapped: true } : c
      );

      // Play sound effect
      playSound('/pages/2/ruch.mp3');

      return newGrid;
    });
  }, [playSound]);

  // Reset function for R key
  const resetGrid = useCallback(() => {
    setGrid(prevGrid =>
      prevGrid.map(cell => ({ ...cell, isSwapped: false }))
    );
  }, []);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        resetGrid();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [resetGrid]);

  // Creatwe a memoized image component that uses cached images
  const CachedImage: React.FC<{ cell: GridCell }> = React.memo(({ cell }) => {
    const src = `/pages/2/${cell.isSwapped ? 'B' : 'A'}/${cell.imageName}`;
    const cachedImg = imageCache.current.get(src);

    if (cachedImg) {
      // Use the cached image src to avoid refetching
      return (
        <img
          src={cachedImg.src}
          alt={`Cell ${cell.id}`}
          className="cell-image"
        />
      );
    }

    // Fallback to regular img if not in cache
    return (
      <img
        src={src}
        alt={`Cell ${cell.id}`}
        className="cell-image"
      />
    );
  });

  return (
    <div className="interactive2-container">
      <div className={`grid-wrapper`}>
        <div className="grid-container">
          {grid.map((cell) => (
            <div
              key={cell.id}
              className="grid-cell"
              onClick={() => handleCellClick(cell.id)}
            >
              <CachedImage cell={cell} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interactive2;