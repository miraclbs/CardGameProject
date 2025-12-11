import { useEffect, useState } from 'react';
import '../styles/NarrativeScreen.css';

export default function NarrativeScreen({ narrative, onComplete, isLoading }) {
    const [fadeIn, setFadeIn] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 100);
        const readingTime = Math.max(3000, narrative.length * 50);
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, readingTime);

        return () => clearTimeout(timer);
    }, [narrative]);

    useEffect(() => {
        if (minTimeElapsed && !isLoading) {
            onComplete();
        }
    }, [minTimeElapsed, isLoading, onComplete]);

    return (
        <div className={`narrative-overlay ${fadeIn ? 'fade-in' : ''}`}>
            <div className="narrative-content">
                <p className="narrative-text">{narrative}</p>
                <div className="narrative-loader">
                    <span>{isLoading ? 'Yeni seçimler hazırlanıyor' : 'Hazır...'}</span>
                    {isLoading && (
                        <div className="loader-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
