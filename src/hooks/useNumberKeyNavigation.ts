import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export const useNumberKeyNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const routes: { [key: string]: string } = {
        '1': '/',
        '2': '/page2',
        '3': '/page3',
        '4': '/page4',
        '5': '/page5',
        '6': '/page6',
      };

      // Handle number key navigation
      if (routes[event.key]) {
        navigate({ to: routes[event.key] });
        return;
      }

      // Handle arrow key navigation
      const routeOrder = ['/', '/page2', '/page3', '/page4', '/page5', '/page6'];
      const currentPath = location.pathname;
      const currentIndex = routeOrder.indexOf(currentPath);

      if (currentIndex !== -1) {
        if (event.key === 'ArrowRight' && currentIndex < routeOrder.length - 1) {
          navigate({ to: routeOrder[currentIndex + 1] });
        } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
          navigate({ to: routeOrder[currentIndex - 1] });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, location]);
};