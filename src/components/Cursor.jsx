import { useState, useEffect } from "react";
import "../styles/Cursor.css";

export default function Cursor() {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className="magic-cursor"
            style={{
                left: cursorPos.x + 'px',
                top: cursorPos.y + 'px'
            }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                    fill="white"
                    opacity="0.8"
                />
            </svg>
        </div>
    );
}
