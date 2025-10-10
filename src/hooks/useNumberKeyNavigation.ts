import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const useNumberKeyNavigation = () => {
  const navigate = useNavigate();

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

      if (routes[event.key]) {
        navigate({ to: routes[event.key] });
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);
};