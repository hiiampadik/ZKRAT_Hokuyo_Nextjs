import {useEffect} from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

export const useSimulateClick = () => {
    const simulateClick = (xPercent: number, yPercent: number) => {
        // Convert percentage to viewport pixels
        const x = (xPercent / 100) * window.innerWidth;
        const y = (yPercent / 100) * window.innerHeight;

        const target = document.elementFromPoint(x, y) as HTMLElement;

        if (target) {
            target.click();
        }
    };

    useEffect(() => {
        socket.on('new_coordinates', (data) => {
            console.log('Přijaté souřadnice (%):', data);

            if (data.x !== undefined && data.y !== undefined) {
                simulateClick(data.x, data.y);
            }
        });

        return () => {
            socket.off('new_coordinates');
        };
    }, []);

}