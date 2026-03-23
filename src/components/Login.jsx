import { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onClose }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const { login, register, error, clearError, isLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setLocalError('');

        if (!isLoginMode && password !== confirmPassword) {
            setLocalError('Şifreler eşleşmiyor!');
            return;
        }

        if (!isLoginMode && username.trim().length < 3) {
            setLocalError('Kullanıcı adı en az 3 karakter olmalı!');
            return;
        }

        if (isLoginMode) {
            const success = await login(email, password);
            if (success && onClose) onClose();
        } else {
            const success = await register(email, password, username);
            if (success && onClose) onClose();
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        clearError();
        setLocalError('');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    const displayError = localError || error;

    return (
        <>
            <div className="rotate-device-overlay">
                <div className="rotate-icon">📱</div>
                <p>Oyunu oynamak için lütfen telefonunuzu yatay konuma çevirin</p>
            </div>
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        {onClose && (
                            <button className="login-close-btn" onClick={onClose} type="button">✕</button>
                        )}
                        <h1 className="login-title">Final Choice</h1>
                        <p className="login-subtitle">
                            {isLoginMode ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {!isLoginMode && (
                            <div className="input-group">
                                <label htmlFor="username">Kullanıcı Adı</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Şifre</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                                disabled={isLoading}
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Şifre Onayı</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {displayError && (
                            <div className="error-message">
                                ⚠️ {displayError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="button-loading">
                                    <span className="spinner-small"></span>
                                    Yükleniyor...
                                </span>
                            ) : (
                                isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {isLoginMode ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                            <button
                                type="button"
                                className="toggle-button"
                                onClick={toggleMode}
                                disabled={isLoading}
                            >
                                {isLoginMode ? 'Kayıt Ol' : 'Giriş Yap'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
