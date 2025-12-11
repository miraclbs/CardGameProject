import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/BlinkTransition.css';

export default function BlinkTransition({ onComplete, onMidpoint, speed = 'normal' }) {
    const [animating, setAnimating] = useState(false);
    const onCompleteRef = useRef(onComplete);
    const onMidpointRef = useRef(onMidpoint);

    useEffect(() => {
        onCompleteRef.current = onComplete;
        onMidpointRef.current = onMidpoint;
    }, [onComplete, onMidpoint]);

    useEffect(() => {
        setAnimating(true);
        const duration = speed === 'fast' ? 800 : 1200;
        const midpoint = duration / 2;

        const midpointTimer = setTimeout(() => {
            if (onMidpointRef.current) {
                onMidpointRef.current();
            }
        }, midpoint);

        const timer = setTimeout(() => {
            setAnimating(false);
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, duration);

        return () => {
            clearTimeout(midpointTimer);
            clearTimeout(timer);
        };
    }, []);

    return createPortal(
        <div className={`blink-overlay ${animating ? 'animating' : ''} ${speed === 'fast' ? 'fast' : ''}`}>
            <div className="blink-top"></div>
            <div className="blink-bottom"></div>
        </div>,
        document.body
    );
}
