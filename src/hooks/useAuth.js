import { useState, useEffect } from 'react';
import authManager from '../utils/authManager';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authManager.onAuthChange((currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        setError('');
        setIsLoading(true);

        const result = await authManager.login(email, password);

        setIsLoading(false);

        if (!result.success) {
            setError(result.error);
            return false;
        }

        return true;
    };

    const register = async (email, password, displayName) => {
        setError('');
        setIsLoading(true);

        const result = await authManager.register(email, password, displayName);

        setIsLoading(false);

        if (!result.success) {
            setError(result.error);
            return false;
        }

        return true;
    };

    const logout = async () => {
        setIsLoading(true);
        await authManager.logout();
        setUser(null);
        setError('');
        setIsLoading(false);
    };

    const clearError = () => {
        setError('');
    };

    return {
        user,
        isLoggedIn: user !== null,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError
    };
}

export default useAuth;
