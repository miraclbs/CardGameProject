import { useState } from 'react';

export function useBlinkTransition({ onFirstMidpoint, onFirstComplete, onSecondMidpoint, onSecondComplete }) {
    const [showFirstBlink, setShowFirstBlink] = useState(false);
    const [showSecondBlink, setShowSecondBlink] = useState(false);

    const startFirstBlink = () => {
        setShowFirstBlink(true);
    };

    const startSecondBlink = () => {
        setShowSecondBlink(true);
    };

    const handleFirstMidpoint = () => {
        if (onFirstMidpoint) onFirstMidpoint();
    };

    const handleFirstComplete = () => {
        setShowFirstBlink(false);
        if (onFirstComplete) onFirstComplete();
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
            startSecondBlink,
            onFirstMidpoint: handleFirstMidpoint,
            onFirstComplete: handleFirstComplete,
            onSecondMidpoint: handleSecondMidpoint,
            onSecondComplete: handleSecondComplete,
        },
    };
}
