import { useEffect } from 'react';

export default function StoryModal({ isOpen, onClose, storyContent }) {
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

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const contentStyle = {
        backgroundColor: '#1a1a2e',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        color: '#fff',
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.3s',
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <button
                    style={closeButtonStyle}
                    onClick={onClose}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                >
                    ×
                </button>
                <div>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                        {storyContent?.name || "Başlangıç Hikayesi"}
                    </h2>
                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {storyContent?.description}
                    </p>
                    {storyContent?.narrative && (
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>
                            {storyContent?.narrative}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}