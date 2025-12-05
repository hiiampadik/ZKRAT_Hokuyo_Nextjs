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

  const handleClick = () => {
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
    </div>
  );
};