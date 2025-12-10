import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {routeOrder} from './useNumberKeyNavigation';

const REDIRECT_TIMEOUT = 90 * 1000; // 90 seconds
const REDIRECT_TIMEOUT_LAST = 180 * 1000; // 180 seconds

export const useInactivityRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const currentIndex = routeOrder.indexOf(currentPath);

    let nextRoute: string;
    if (currentIndex !== -1 && currentIndex < routeOrder.length - 1) {
      nextRoute = routeOrder[currentIndex + 1];
    } else {
      nextRoute = routeOrder[0];
    }

    const timeoutDuration = currentPath === '/page6' ? REDIRECT_TIMEOUT_LAST : REDIRECT_TIMEOUT;

    const timeout = setTimeout(() => {
      navigate({ to: nextRoute });
    }, timeoutDuration);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentPath, navigate]);
};