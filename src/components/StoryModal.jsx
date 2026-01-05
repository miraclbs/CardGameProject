import { useEffect } from 'react';
import '../styles/StoryModal.css';

export default function StoryModal({ isOpen, onClose, introScene, storyHistory = [], currentScene }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="story-modal-overlay" onClick={onClose}>
            <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="story-modal-close" onClick={onClose}>×</button>

                <h2 className="story-modal-title">📜 Hikaye Özeti</h2>

                <div className="story-timeline">
                    {introScene && (
                        <div className="timeline-item intro">
                            <div className="timeline-marker">📍</div>
                            <div className="timeline-content">
                                <h3>{introScene.name}</h3>
                                <p>{introScene.description}</p>
                                {introScene.narrative && (
                                    <p className="narrative-text">{introScene.narrative}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {storyHistory.map((entry, index) => {
                        const oxygenChange = entry.oxygenAfter - entry.oxygenBefore;
                        const hasOxygen = entry.oxygenBefore !== undefined && entry.oxygenBefore !== null &&
                            entry.oxygenAfter !== undefined && entry.oxygenAfter !== null;

                        return (
                            <div key={index} className="timeline-item">
                                <div className="timeline-marker">{index + 1}</div>
                                <div className="timeline-content">
                                    <div className="choice-made">
                                        <span className="choice-label">Seçim:</span>
                                        <span className="choice-text">{entry.choice}</span>
                                    </div>
                                    {entry.result && (
                                        <p className="result-text">{entry.result}</p>
                                    )}
                                    {hasOxygen && (
                                        <div className="oxygen-change">
                                            <span className={`oxygen-badge ${oxygenChange > 0 ? 'positive' : oxygenChange < 0 ? 'negative' : 'neutral'}`}>
                                                O₂: {oxygenChange > 0 ? '+' : ''}{oxygenChange}%
                                            </span>
                                            <span className="oxygen-total">({entry.oxygenAfter}%)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {currentScene && storyHistory.length > 0 && (
                        <div className="timeline-item current">
                            <div className="timeline-marker">📍</div>
                            <div className="timeline-content">
                                <h3>Şu an: {currentScene.name}</h3>
                                <p>{currentScene.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                {storyHistory.length === 0 && (
                    <p className="no-progress">Henüz ilerleme kaydedilmedi. Seçimler yaptıkça hikaye burada görünecek.</p>
                )}
            </div>
        </div>
    );
}