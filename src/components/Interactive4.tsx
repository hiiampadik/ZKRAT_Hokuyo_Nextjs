import React, { useState, useCallback } from 'react';
import { useAudioPool } from '../hooks/useAudioPool';
import { useClickAnimation } from '../hooks/useClickAnimation';
import ClickAnimation from './ClickAnimation';
import './Interactive4.sass';

const Interactive4: React.FC = () => {
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.6 });

  // Use click animation hook
  const { clickAnimations, addClickAnimation } = useClickAnimation();

  // General click handler for animation
  const handleContainerClick = useCallback((event: React.MouseEvent) => {
    addClickAnimation(event);
  }, [addClickAnimation]);

  const handleRectClick = (rectNumber: number) => {
    setVisibleImages(prev => {
      if (!prev.has(rectNumber)) {
        playSound('/pages/4/mapa.mp3');
      }
      return new Set([...Array.from(prev), rectNumber]);
    });
  };

  return (
      <div className="interactive4-container">
          <div className="image-container" onClick={handleContainerClick}>
              <img
                  src="/pages/4/stena-interakce4K.jpg"
                  alt="Background"
                  className="background-image"
              />
              <div className="rect1" onClick={() => handleRectClick(2)}></div>
              <div className="rect2" onClick={() => handleRectClick(4)}></div>
              <div className="rect3" onClick={() => handleRectClick(6)}></div>
              <div className="rect4" onClick={() => handleRectClick(8)}></div>
              <div className="rect5" onClick={() => handleRectClick(7)}></div>
              <div className="rect6" onClick={() => handleRectClick(3)}></div>
              <div className="rect7" onClick={() => handleRectClick(5)}></div>
              <div className="rect8" onClick={() => handleRectClick(1)}></div>
              <div className="rect9" onClick={() => handleRectClick(9)}></div>
              <div className="rect10" onClick={() => handleRectClick(10)}></div>

              {Array.from(visibleImages).map(imageNumber => (
                <img
                  key={imageNumber}
                  src={`/pages/4/${imageNumber}.png`}
                  alt={`Overlay ${imageNumber}`}
                  className="overlay-image"
                />
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
  )
};

export default Interactive4;