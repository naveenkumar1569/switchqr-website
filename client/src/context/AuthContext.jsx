import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [planInfo, setPlanInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch plan information and user profile when token changes
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                try {
                    // Fetch Plan Info
                    const planResponse = await apiGet('/api/plan', token);
                    if (planResponse.ok) {
                        const planData = await planResponse.json();
                        setPlanInfo(planData);
                    } else {
                        setPlanInfo(null);
                    }

                    // Fetch User Profile if not already set
                    if (!user) {
                        const userResponse = await apiGet('/api/users/profile', token);
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            setUser(userData);
                        }
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    setPlanInfo(null);
                }
            } else {
                setPlanInfo(null);
                setUser(null);
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setPlanInfo(null);
        }
    }, [token]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setPlanInfo(null);
    };

    const refreshPlan = async () => {
        if (token) {
            try {
                const response = await apiGet('/api/plan', token);
                if (response.ok) {
                    const data = await response.json();
                    setPlanInfo(data);
                }
            } catch (error) {
                console.error('Error refreshing plan info:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, planInfo, loading, login, logout, refreshPlan }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
