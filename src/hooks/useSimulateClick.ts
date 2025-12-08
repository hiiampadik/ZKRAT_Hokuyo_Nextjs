import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSimulateClick = () => {
    // Inicializace socketu jen jednou pro celou appku
    if (!socket) {
        socket = io('http://127.0.0.1:5000', {
            transports: ['websocket'], // nutné pro přímý websocket, ne fallback
            reconnection: true,        // opětovné připojení při výpadku
        });
    }

    const simulateClick = (xPercent: number, yPercent: number) => {
        const x = (xPercent / 100) * window.innerWidth;
        const y = (yPercent / 100) * window.innerHeight;

        const target = document.elementFromPoint(x, y) as HTMLElement;
        if (target) {
            // Create a synthetic mouse event with proper coordinates
            const mouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
            });
            target.dispatchEvent(mouseEvent);
        }
    };

    useEffect(() => {
        const handleData = (data: { x: number; y: number }) => {
            console.log('📡 Přijaté souřadnice:', data);
            simulateClick(data.x, data.y);
        };

        socket?.on('new_coordinates', handleData);

        // cleanup při unmountu
        return () => {
            socket?.off('new_coordinates', handleData);
        };
    }, []);
};
