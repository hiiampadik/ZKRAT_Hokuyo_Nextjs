import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  const pleskAudioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

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

  // Timer to add videos every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTiles(prevTiles => {
        const emptyTiles = prevTiles.filter(tile => !tile.hasVideo && !tile.isClicked);
        if (emptyTiles.length === 0) return prevTiles;

        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const randomTile = emptyTiles[randomIndex];

        return prevTiles.map(tile =>
          tile.id === randomTile.id
            ? {
                ...tile,
                hasVideo: true,
                videoPosition: {
                  x: Math.random() * 10, // Random position within tile
                  y: Math.random() * 10
                }
              }
            : tile
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Play plesk sound
  const playPleskSound = useCallback(() => {
    if (pleskAudioRef.current) {
      try {
        pleskAudioRef.current.volume = 0.5;
        pleskAudioRef.current.currentTime = 0;
        pleskAudioRef.current.play().catch(err => {
          console.error('Plesk audio playback failed:', err);
        });
      } catch (error) {
        console.error('Error playing plesk audio:', error);
      }
    }
  }, []);

  // Handle video click
  const handleVideoClick = useCallback((tileId: number) => {
    // Start background music on first click
    startBackgroundMusic();

    playPleskSound();

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
    setTimeout(() => {
      setTiles(prevTiles =>
        prevTiles.map(tile =>
          tile.id === tileId
            ? { ...tile, showRedRectangle: false, isClicked: true }
            : tile
        )
      );
    }, 1000);
  }, [playPleskSound, startBackgroundMusic]);

  // Check if 20 videos have been clicked and redirect
  useEffect(() => {
    if (clickedCount >= 20) {
      navigate({ to: '/' });
    }
  }, [clickedCount, navigate]);

  return (
    <div className="interactive6-container">
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
      </div>

      {/* Audio elements */}
      <audio ref={songAudioRef} src="/pages/6/song.mp3" loop preload="auto" />
      <audio ref={pleskAudioRef} src="/pages/6/plesk.mp3" preload="auto" />
    </div>
  );
};

export default Interactive6;