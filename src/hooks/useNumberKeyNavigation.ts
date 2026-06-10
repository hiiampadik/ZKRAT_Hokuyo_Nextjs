import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';


export const routeOrder = [
  '/',
  '/video2',

  '/page1',

  '/video3',
  '/video4',

  '/page2',

  '/video5',

  '/page3',

  '/video6',
  '/video7',

  '/page4',

  '/video8',
  '/video9',

  '/page5',

  '/video10',

  '/page6',
];

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