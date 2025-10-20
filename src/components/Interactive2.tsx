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

  // Store prefetched images
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

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
          // Store the loaded image in cache
          imageCache.current.set(src, img);
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

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (ruchAudioRef.current) {
        ruchAudioRef.current.pause();
      }
    };
  }, []);

  // Play sound function
  const playSound = useCallback(() => {
    if (ruchAudioRef.current) {
      try {
        // Reset and play the original audio element
        ruchAudioRef.current.volume = 1.0;
        ruchAudioRef.current.currentTime = 0;

        const playPromise = ruchAudioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio played successfully:', ruchAudioRef.current?.src);
            })
            .catch(err => {
              console.error('Audio playback failed:', err);
              console.error('Audio src:', ruchAudioRef.current?.src);
              console.error('Audio readyState:', ruchAudioRef.current?.readyState);
              console.error('Audio networkState:', ruchAudioRef.current?.networkState);
            });
        }
      } catch (error) {
        console.error('Error playing audio:', error);
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

      <audio ref={ruchAudioRef} src="/pages/2/ruch.mp3" preload="auto" />
    </div>
  );
};

export default Interactive2;