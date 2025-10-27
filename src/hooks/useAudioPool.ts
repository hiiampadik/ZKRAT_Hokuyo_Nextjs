import { useRef, useCallback, useEffect } from 'react';

export interface AudioPoolConfig {
  maxPoolSize?: number;
  volume?: number;
}

export const useAudioPool = (config: AudioPoolConfig = {}) => {
  const { maxPoolSize = 5, volume = 0.4 } = config;

  const audioPoolsRef = useRef<Map<string, HTMLAudioElement[]>>(new Map());

  const playSound = useCallback((src: string) => {
    try {
      // Get or create pool for this source
      if (!audioPoolsRef.current.has(src)) {
        audioPoolsRef.current.set(src, []);
      }

      const pool = audioPoolsRef.current.get(src)!;

      // Find an available audio instance or create a new one
      let audio = pool.find(a => a.paused || a.ended);

      if (!audio) {
        if (pool.length < maxPoolSize) {
          // Create new audio instance if under limit
          audio = new Audio(src);
          pool.push(audio);
        } else {
          // Reuse the oldest audio instance if at limit
          audio = pool[0];
          pool.push(pool.shift()!); // Move to end of array
          audio.pause();
          audio.currentTime = 0;
        }
      }

      audio.volume = volume;
      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio played successfully:', src);
          })
          .catch(err => {
            console.error('Audio playback failed:', err);
          });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [maxPoolSize, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all audio pools
      audioPoolsRef.current.forEach(pool => {
        pool.forEach(audio => {
          audio.pause();
          audio.src = '';
        });
      });
      audioPoolsRef.current.clear();
    };
  }, []);

  return { playSound };
};