import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAudioPool } from '../hooks/useAudioPool';
import { useClickAnimation } from '../hooks/useClickAnimation';
import { useInactivityRedirect } from '../hooks/useInactivityRedirect';
import ClickAnimation from './ClickAnimation';
import './Interactive6.sass';

interface GridTile {
  id: number;
  row: number;
  col: number;
  hasVideo: boolean;
  isClicked: boolean;
  showRedRectangle: boolean;
}

const Interactive6: React.FC = () => {
  const ROWS = 5;
  const COLS = 10;

  const [tiles, setTiles] = useState<GridTile[]>([]);
  const [clickedCount, setClickedCount] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const songAudioRef = useRef<HTMLAudioElement>(null);
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.5 });
  const navigate = useNavigate();

  // Use click animation hook
  const { clickAnimations, addClickAnimation } = useClickAnimation();

  // Use inactivity redirect hook - redirects to next page after 10s
  useInactivityRedirect();

  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize grid
  useEffect(() => {
    const initialTiles: GridTile[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        initialTiles.push({
          id: row * COLS + col,
          row,
          col,
          hasVideo: false,
          isClicked: false,
          showRedRectangle: false,
        });
      }
    }
    setTiles(initialTiles);
  }, []);

  // Start background music after first video click
  const startBackgroundMusic = useCallback(() => {
    if (songAudioRef.current && !musicStarted) {
      songAudioRef.current.volume = 0.5;
      songAudioRef.current.play()
        .then(() => {
          console.log('Background music started');
          setMusicStarted(true);
        })
        .catch(err => {
          console.warn('Background music play failed:', err);
        });
    }
  }, [musicStarted]);

  // Timer to add videos every 1 second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTiles(prevTiles => {
        const emptyTiles = prevTiles.filter(tile => !tile.hasVideo && !tile.isClicked);
        if (emptyTiles.length === 0) return prevTiles;

        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const randomTile = emptyTiles[randomIndex];

        return prevTiles.map(tile =>
          tile.id === randomTile.id
            ? { ...tile, hasVideo: true }
            : tile
        );
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);


  // General click handler for animation
  const handleContainerClick = useCallback((event: React.MouseEvent) => {
    addClickAnimation(event);
  }, [addClickAnimation]);

  // Handle video click
  const handleVideoClick = useCallback((tileId: number) => {
    // Start background music on first click
    startBackgroundMusic();

    playSound('/pages/6/plesk.mp3');

    setTiles(prevTiles =>
      prevTiles.map(tile =>
        tile.id === tileId
          ? { ...tile, hasVideo: false, showRedRectangle: true }
          : tile
      )
    );

    // Increment clicked count
    setClickedCount(prev => prev + 1);

    // Remove red rectangle after 1 second and mark as clicked
    const timeoutId = setTimeout(() => {
      setTiles(prevTiles =>
        prevTiles.map(tile =>
          tile.id === tileId
            ? { ...tile, showRedRectangle: false, isClicked: true }
            : tile
        )
      );
      timeoutsRef.current.delete(timeoutId);
    }, 1000);

    timeoutsRef.current.add(timeoutId);
  }, [playSound, startBackgroundMusic]);

  // Check if 20 videos have been clicked and redirect
  useEffect(() => {
    if (clickedCount >= 20) {
      navigate({ to: '/video7' });
    }
  }, [clickedCount, navigate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  return (
    <div className="interactive6-container" onClick={handleContainerClick}>
      <div className="grid-container">
        {tiles.map((tile) => (
          <div key={tile.id} className="grid-tile">
            {tile.hasVideo && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="tile-video"
                onClick={() => handleVideoClick(tile.id)}
              >
                <source src="/pages/6/krecek-smycka.mp4" type="video/mp4" />
              </video>
            )}
            {tile.showRedRectangle && (
              <img src="/pages/6/cakanec.png" alt="Cakanec" className="cakanec-image" />
            )}
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

      {/* Audio elements */}
      <audio ref={songAudioRef} src="/pages/6/song.mp3" loop preload="auto" />
    </div>
  );
};

export default Interactive6;