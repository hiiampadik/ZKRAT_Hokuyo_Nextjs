import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

const REDIRECT_TIMEOUT = 90 * 1000; // 90 seconds

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

export const useInactivityRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = routeOrder.indexOf(currentPath);

    let nextRoute: string;
    if (currentIndex !== -1 && currentIndex < routeOrder.length - 1) {
      nextRoute = routeOrder[currentIndex + 1];
    } else {
      nextRoute = routeOrder[0];
    }

    const timeout = setTimeout(() => {
      navigate({ to: nextRoute });
    }, REDIRECT_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, location.pathname]);
};