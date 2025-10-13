import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Audio ref for sound effect
  const ruchAudioRef = useRef<HTMLAudioElement>(null);

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

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    const loadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.src = src;
      });
    };

    // Load all images in parallel
    Promise.all(imagesToLoad.map(loadImage)).then(() => {
      // All images loaded or failed
      console.log('All images prefetched');
    });
  }, []);

  // Show grid with delay after images are loaded
  useEffect(() => {
    if (imagesLoaded) {
      const timer = setTimeout(() => {
        setShowGrid(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded]);

  // Cleanup audio element on unmount
  useEffect(() => {
    const ruchAudio = ruchAudioRef.current;
    return () => {
      if (ruchAudio) {
        ruchAudio.pause();
        ruchAudio.src = '';
      }
    };
  }, []);

  // Play sound function
  const playSound = useCallback(() => {
    if (ruchAudioRef.current) {
      ruchAudioRef.current.currentTime = 0;
      ruchAudioRef.current.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
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
      playSound();

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

  return (
    <div className="interactive2-container">
      <div className={`grid-wrapper ${showGrid ? 'visible' : ''}`}>
        <div className="grid-container">
          {grid.map((cell) => (
            <div
              key={cell.id}
              className="grid-cell"
              onClick={() => handleCellClick(cell.id)}
            >
              <img
                src={`/pages/2/${cell.isSwapped ? 'B' : 'A'}/${cell.imageName}`}
                alt={`Cell ${cell.id}`}
                className="cell-image"
              />
            </div>
          ))}
        </div>
      </div>

      <audio ref={ruchAudioRef} src="/pages/2/ruch.mp3" preload="auto" />
    </div>
  );
};

export default Interactive2;