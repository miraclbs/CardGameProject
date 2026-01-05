import { useEffect, useState } from 'react';
import '../styles/NarrativeScreen.css';

export default function NarrativeScreen({ narrative, onComplete, isLoading }) {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 100);
    }, [narrative]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isLoading) {
                e.preventDefault();
                onComplete();
            }
        };

        if (!isLoading) {
            window.addEventListener('keydown', handleKeyPress);
            return () => window.removeEventListener('keydown', handleKeyPress);
        }
    }, [isLoading, onComplete]);

    return (
        <div className={`narrative-overlay ${fadeIn ? 'fade-in' : ''}`}>
            <div className="narrative-content">
                <p className="narrative-text">{narrative}</p>
                <div className="narrative-loader">
                    <span>{isLoading ? 'Yeni seçimler hazırlanıyor' : 'Devam etmek için SPACE veya ENTER tuşuna basın'}</span>
                    {isLoading && (
                        <div className="loader-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>);
}