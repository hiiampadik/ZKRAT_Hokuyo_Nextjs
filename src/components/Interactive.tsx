import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Interactive.sass';

interface GridCell {
  id: number;
  image: 'strom' | 'medved';
  visible: boolean;
}

const Interactive: React.FC = () => {
  const ROWS = 6;
  const COLS = 15;
  const TOTAL_CELLS = ROWS * COLS;

  const [grid, setGrid] = useState<GridCell[]>([]);

  // Use single refs to prevent recreation on each render
  const stromAudioRef = useRef<HTMLAudioElement>(null);
  const medvedAudioRef = useRef<HTMLAudioElement>(null);
  const famfaraAudioRef = useRef<HTMLAudioElement>(null);

  // Initialize grid only once
  useEffect(() => {
    const initialGrid: GridCell[] = [];
    for (let i = 0; i < TOTAL_CELLS; i++) {
      initialGrid.push({
        id: i,
        image: Math.random() < 0.9 ? 'strom' : 'medved',
        visible: true,
      });
    }
    setGrid(initialGrid);
  }, []); // Empty dependency array ensures this runs only once

  // Memoized reset function to prevent recreation
  const resetGrid = useCallback(() => {
    setGrid(prevGrid =>
      prevGrid.map(cell => ({ ...cell, visible: true }))
    );
  }, []);

  // Keyboard event listener with proper cleanup
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

  // Cleanup audio elements on unmount
  useEffect(() => {
    const stromAudio = stromAudioRef.current;
    const medvedAudio = medvedAudioRef.current;
    const famfaraAudio = famfaraAudioRef.current;

    return () => {
      // Pause and clean up audio elements
      if (stromAudio) {
        stromAudio.pause();
        stromAudio.src = '';
      }
      if (medvedAudio) {
        medvedAudio.pause();
        medvedAudio.src = '';
      }
      if (famfaraAudio) {
        famfaraAudio.pause();
        famfaraAudio.src = '';
      }
    };
  }, []);

  // Memoized play sound function
  const playSound = useCallback((audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      // Stop and reset any currently playing instance
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
    }
  }, []);

  // Optimized click handler with useCallback
  const handleCellClick = useCallback((cellId: number) => {
    setGrid(prevGrid => {
      const cell = prevGrid.find(c => c.id === cellId);
      if (!cell || !cell.visible) return prevGrid;

      const newGrid = prevGrid.map(c =>
        c.id === cellId ? { ...c, visible: false } : c
      );

      // Calculate visible count from the new grid
      const newVisibleCount = newGrid.filter(c => c.visible).length;

      // Play appropriate sound
      if (newVisibleCount === 0) {
        playSound(famfaraAudioRef);
      } else if (cell.image === 'strom') {
        playSound(stromAudioRef);
      } else {
        playSound(medvedAudioRef);
      }

      return newGrid;
    });
  }, [playSound]);

  return (
    <div className="interactive-container">
      <img
        src="/pages/1/velka-morava.png"
        alt="Background"
        className="background-image"
      />

      <div className="grid-container">
        {grid.map((cell) => (
          <div
            key={cell.id}
            className={`grid-cell ${!cell.visible ? 'hidden' : ''}`}
            onClick={() => handleCellClick(cell.id)}
          >
            {cell.visible && (
              <img
                src={`/pages/1/${cell.image === 'strom' ? 'strom.png' : 'medved1.png'}`}
                alt={cell.image}
                className="cell-image"
              />
            )}
          </div>
        ))}
      </div>

      <audio ref={stromAudioRef} src="/pages/1/strom.mp3" preload="auto" />
      <audio ref={medvedAudioRef} src="/pages/1/medved.mp3" preload="auto" />
      <audio ref={famfaraAudioRef} src="/pages/1/famfara.mp3" preload="auto" />
    </div>
  );
};

export default Interactive;