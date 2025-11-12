import { useState, useCallback, useRef, useEffect } from 'react';

interface ClickAnimation {
  id: string;
  x: number;
  y: number;
}

export const useClickAnimation = () => {
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const addClickAnimation = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const id = `click-${Date.now()}-${Math.random()}`;
    const newAnimation: ClickAnimation = { id, x, y };

    setClickAnimations(prev => [...prev, newAnimation]);

    // Remove animation after it completes
    const timeoutId = setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== id));
      timeoutsRef.current.delete(timeoutId);
    }, 600); // Animation duration

    timeoutsRef.current.add(timeoutId);
  }, []);

  const removeClickAnimation = useCallback((id: string) => {
    setClickAnimations(prev => prev.filter(anim => anim.id !== id));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  return {
    clickAnimations,
    addClickAnimation,
    removeClickAnimation
  };
};