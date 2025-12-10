import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAudioPool } from '../hooks/useAudioPool';
import { useClickAnimation } from '../hooks/useClickAnimation';
import { useInactivityRedirect } from '../hooks/useInactivityRedirect';
import ClickAnimation from './ClickAnimation';
import './Interactive3.sass';

interface CoinCell {
  id: string;
  folder: string;
  frontImage: string;
  backImage: string;
  isFlipped: boolean;
  isFlipping: boolean;
}

const Interactive3: React.FC = () => {
  const [coins, setCoins] = useState<CoinCell[]>([]);
  const navigate = useNavigate();
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.7 });
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Use click animation hook
  const { clickAnimations, addClickAnimation } = useClickAnimation();

  // Use inactivity redirect hook - redirects to next page after 10s
  useInactivityRedirect();

  // Initialize coins from each folder
  useEffect(() => {
    const folders = [
      'bojislav',
      'dobroslav',
      'horislav',
      'miloslav1',
      'miloslav2',
      'pravoslav',
      'velislav'
    ];

    const initialCoins: CoinCell[] = folders.map(folder => {
      // Special handling for miloslav2 folder which has different naming
      const frontImage = `${folder}1.png`;
      const backImage = `${folder}2.png`;

      return {
        id: folder,
        folder,
        frontImage,
        backImage,
        isFlipped: false,
        isFlipping: false
      };
    });

    setCoins(initialCoins);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  // General click handler for animation
  const handleContainerClick = useCallback((event: React.MouseEvent) => {
    addClickAnimation(event);
  }, [addClickAnimation]);

  // Handle coin click - flip with animation
  const handleCoinClick = useCallback((coinId: string) => {
    setCoins(prevCoins => {
      const coin = prevCoins.find(c => c.id === coinId);

      // Don't flip if already flipped or currently flipping
      if (!coin || coin.isFlipped || coin.isFlipping) return prevCoins;

      // Start flipping animation
      const newCoins = prevCoins.map(c =>
        c.id === coinId ? { ...c, isFlipping: true } : c
      );

      // Play sound
      playSound('/pages/3/vrzani.mp3');

      // After animation completes, set as flipped
      const timeoutId = setTimeout(() => {
        setCoins(currentCoins => {
          const updatedCoins = currentCoins.map(c =>
            c.id === coinId
              ? { ...c, isFlipped: true, isFlipping: false }
              : c
          );

          // Check if all coins are flipped
          const allFlipped = updatedCoins.every(c => c.isFlipped);
          if (allFlipped) {
            // Navigate after a short delay
            setTimeout(() => {
              navigate({ to: '/video6' });
            }, 500);
          }

          return updatedCoins;
        });
        timeoutsRef.current.delete(timeoutId);
      }, 1200); // Match animation duration

      timeoutsRef.current.add(timeoutId);

      return newCoins;
    });
  }, [playSound, navigate]);

  // Reset function for R key
  const resetCoins = useCallback(() => {
    setCoins(prevCoins =>
      prevCoins.map(coin => ({
        ...coin,
        isFlipped: false,
        isFlipping: false
      }))
    );
  }, []);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        resetCoins();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [resetCoins]);

  return (
    <div className="interactive3-container" onClick={handleContainerClick}>
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={`coin-container ${coin.isFlipped ? 'disabled' : ''} coin-${coin.folder}`}
            onClick={() => handleCoinClick(coin.id)}
          >
            <div className={`coin ${coin.isFlipping ? 'flipping' : ''} ${coin.isFlipped ? 'flipped' : ''}`}>
              <div className="coin-face coin-front">
                <img
                  src={`/pages/3/${coin.folder}/${coin.frontImage}`}
                  alt={`${coin.folder} front`}
                />
              </div>
              <div className="coin-face coin-back">
                <img
                  src={`/pages/3/${coin.folder}/${coin.backImage}`}
                  alt={`${coin.folder} back`}
                />
              </div>
            </div>
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
  );
};

export default Interactive3;