import { useState, useCallback } from 'react';

interface ClickAnimation {
  id: string;
  x: number;
  y: number;
}

export const useClickAnimation = () => {
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);

  const addClickAnimation = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const id = `click-${Date.now()}-${Math.random()}`;
    const newAnimation: ClickAnimation = { id, x, y };

    setClickAnimations(prev => [...prev, newAnimation]);

    // Remove animation after it completes
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 600); // Animation duration
  }, []);

  const removeClickAnimation = useCallback((id: string) => {
    setClickAnimations(prev => prev.filter(anim => anim.id !== id));
  }, []);

  return {
    clickAnimations,
    addClickAnimation,
    removeClickAnimation
  };
};