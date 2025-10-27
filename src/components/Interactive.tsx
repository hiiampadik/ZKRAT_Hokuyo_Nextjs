import React, { useState, useEffect, useCallback } from 'react';
import { useAudioPool } from '../hooks/useAudioPool';
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

  // Use audio pool hook for overlapping sound playback
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.4 });

  // Audio file paths
  const stromAudioSrc = '/pages/1/strom.mp3';
  const medvedAudioSrc = '/pages/1/medved.mp3';
  const famfaraAudioSrc = '/pages/1/famfara.mp3';

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
        playSound(famfaraAudioSrc);
      } else if (cell.image === 'strom') {
        playSound(stromAudioSrc);
      } else {
        playSound(medvedAudioSrc);
      }

      return newGrid;
    });
  }, [playSound, stromAudioSrc, medvedAudioSrc, famfaraAudioSrc]);

  return (
    <div className="interactive-container">
      <img
        src="/pages/1/velka-morava.jpg"
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
                src={`/pages/1/${cell.image === 'strom' ? 'strom.jpg' : 'medved1.jpg'}`}
                alt={cell.image}
                className="cell-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interactive;