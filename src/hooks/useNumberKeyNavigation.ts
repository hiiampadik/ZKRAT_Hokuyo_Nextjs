import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export const useNumberKeyNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const routes: { [key: string]: string } = {
        '1': '/page1',
        '2': '/page2',
        '3': '/page3',
        '4': '/page4',
        '5': '/page5',
        '6': '/page6',
      };

      // Handle number key navigation - jump directly to pages
      if (routes[event.key]) {
        navigate({ to: routes[event.key] });
        return;
      }

      // Handle arrow key navigation through the full sequence
      // Sequence: video1 (/) → page1 → video2 → page2 → video3 → page3 → video4 → page4 → video5 → page5 → video6 → page6 → video7
      const routeOrder = [
        '/',        // video1 (first, requires click)
        '/page1',   // page1
        '/video2',  // video2
        '/page2',   // page2
        '/video3',  // video3
        '/page3',   // page3
        '/video4',  // video4
        '/page4',   // page4
        '/video5',  // video5
        '/page5',   // page5
        '/video6',  // video6
        '/page6',   // page6
        '/video7',  // video7 (last)
      ];

      const currentPath = location.pathname;
      const currentIndex = routeOrder.indexOf(currentPath);

      if (currentIndex !== -1) {
        if (event.key === 'ArrowRight') {
          if (currentIndex < routeOrder.length - 1) {
            navigate({to: routeOrder[currentIndex + 1]});
          } else {
            navigate({to: routeOrder[0]});
          }
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