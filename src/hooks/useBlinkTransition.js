import { useState } from 'react';

export function useBlinkTransition({ onFirstMidpoint, onFirstComplete, onSecondMidpoint, onSecondComplete }) {
    const [showFirstBlink, setShowFirstBlink] = useState(false);
    const [showSecondBlink, setShowSecondBlink] = useState(false);

    const startFirstBlink = () => {
        setShowFirstBlink(true);
    };

    const handleFirstMidpoint = () => {
        if (onFirstMidpoint) onFirstMidpoint();
    };

    const handleFirstComplete = () => {
        setShowFirstBlink(false);
        if (onFirstComplete) onFirstComplete();

        setTimeout(() => {
            setShowSecondBlink(true);
        }, 3000);
    };

    const handleSecondMidpoint = () => {
        if (onSecondMidpoint) onSecondMidpoint();
    };

    const handleSecondComplete = () => {
        setShowSecondBlink(false);
        if (onSecondComplete) onSecondComplete();
    };

    return {
        blinkState: {
            showFirstBlink,
            showSecondBlink,
        },
        handlers: {
            startFirstBlink,
            onFirstMidpoint: handleFirstMidpoint,
            onFirstComplete: handleFirstComplete,
            onSecondMidpoint: handleSecondMidpoint,
            onSecondComplete: handleSecondComplete,
        },
    };
}
