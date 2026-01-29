import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [planInfo, setPlanInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch plan information and user profile when token changes
    useEffect(() => {
        const initializeAuth = async () => {
            let currentToken = token;

            // Check for Supabase session if no local token (e.g. OAuth redirect)
            if (!currentToken) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    currentToken = session.access_token;
                    setToken(currentToken);
                }
            }

            if (currentToken) {
                try {
                    // Fetch Plan Info
                    const planResponse = await apiGet('/api/plan', currentToken);
                    if (planResponse.ok) {
                        const planData = await planResponse.json();
                        setPlanInfo(planData);
                    } else {
                        setPlanInfo(null);
                    }

                    // Fetch User Profile if not already set
                    if (!user) {
                        const userResponse = await apiGet('/api/users/profile', currentToken);
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

    // Supabase Auth Listener (Handles OAuth Redirects)
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.access_token && session.access_token !== token) {
                    setToken(session.access_token);
                }
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        });

        return () => subscription.unsubscribe();
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

    const logout = async () => {
        await supabase.auth.signOut();
        setToken(null);
        setUser(null);
        setPlanInfo(null);
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
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
        <AuthContext.Provider value={{ user, token, planInfo, loading, login, logout, signInWithGoogle, refreshPlan }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
