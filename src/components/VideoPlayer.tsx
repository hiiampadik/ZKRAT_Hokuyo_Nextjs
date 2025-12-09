import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface VideoPlayerProps {
  videoSrc: string;
  nextRoute: string;
  requireClick?: boolean; // First video waits for click
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  nextRoute,
  requireClick = false
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWaitingForClick, setIsWaitingForClick] = useState(requireClick);

  // useSimulateClick()

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      navigate({ to: nextRoute });
    };

    const handleCanPlay = () => {
      if (!requireClick) {
        video.play().catch(err => console.error('Autoplay failed:', err));
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [navigate, nextRoute, requireClick]);

  useEffect(() => {
    if (!requireClick) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && isWaitingForClick && videoRef.current) {
        videoRef.current.play().catch(err => console.error('Play failed:', err));
        setIsWaitingForClick(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWaitingForClick, requireClick]);

  const handleClick = (event: React.MouseEvent) => {
    if (isWaitingForClick && videoRef.current) {
      videoRef.current.play().catch(err => console.error('Play failed:', err));
      setIsWaitingForClick(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isWaitingForClick ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        playsInline
        preload="auto"
      />
      {isWaitingForClick && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            fontSize: '50px',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none',
            paddingBottom: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={'/pages/Start.jpg'}
            alt="Start"
            style={{ width: '15vw', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};