import { useState, useEffect } from "react";
import "../styles/MagicCursor.css";

export default function MagicCursor() {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });

            if (isClicking && Math.random() > 0.6) {
                const particleCount = Math.floor(Math.random() * 2) + 1;

                for (let i = 0; i < particleCount; i++) {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-trail clicking';

                    const offsetX = (Math.random() - 0.5) * 8;
                    const offsetY = (Math.random() - 0.5) * 8;

                    trail.style.left = (e.clientX + offsetX) + 'px';
                    trail.style.top = (e.clientY + offsetY) + 'px';
                    trail.style.transform = 'translate(-50%, -50%)';
                    trail.style.animationDelay = (Math.random() * 0.1) + 's';

                    document.body.appendChild(trail);
                    setTimeout(() => trail.remove(), 1000);
                }
            }
        };

        let clickTimeout;
        const handleMouseDown = () => {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
                setIsClicking(true);
            }, 500);
        };

        const handleMouseUp = () => {
            clearTimeout(clickTimeout);
            setIsClicking(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            clearTimeout(clickTimeout);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isClicking]);

    return (
        <div
            className={`magic-cursor ${isClicking ? 'clicking' : ''}`}
            style={{
                left: cursorPos.x + 'px',
                top: cursorPos.y + 'px'
            }}
        >
            <svg width="32" height="32" viewBox="0 0 40 40" className="cursor-star">
                <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z"
                    fill="white"
                    fillOpacity="0.7" />
            </svg>
        </div>
    );
}
