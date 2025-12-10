import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAudioPool } from '../hooks/useAudioPool';
import { useClickAnimation } from '../hooks/useClickAnimation';
import { useInactivityRedirect } from '../hooks/useInactivityRedirect';
import ClickAnimation from './ClickAnimation';
import './Interactive2.sass';

interface GridCell {
  id: number;
  imageName: string;
  isSwapped: boolean;
}

const Interactive2: React.FC = () => {
  const ROWS = 4;
  const COLS = 8;
  const TOTAL_CELLS = ROWS * COLS;

  const [grid, setGrid] = useState<GridCell[]>([]);
  const navigate = useNavigate();

  // Use audio pool hook for sound playback
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.8 });

  // Use click animation hook
  const { clickAnimations, addClickAnimation } = useClickAnimation();

  // Use inactivity redirect hook - redirects to next page after 10s
  useInactivityRedirect();

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

  // General click handler for animation
  const handleContainerClick = useCallback((event: React.MouseEvent) => {
    addClickAnimation(event);
  }, [addClickAnimation]);

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

      // Play sound effect - play the same number as the cell ID (1-based)
      playSound(`/pages/2/sounds/${cellId + 1}.mp3`);

      // Check if all images are swapped
      const allSwapped = newGrid.every(c => c.isSwapped);
      if (allSwapped) {
        // Small delay before navigation to let the last sound play
        setTimeout(() => {
          navigate({ to: '/video3' });
        }, 500);
      }

      return newGrid;
    });
  }, [playSound, navigate]);

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
    <div className="interactive2-container" onClick={handleContainerClick}>
      <div className={`grid-wrapper`}>
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

          {/* Click animations */}
          {clickAnimations.map((animation) => (
            <ClickAnimation
              key={animation.id}
              x={animation.x}
              y={animation.y}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interactive2;