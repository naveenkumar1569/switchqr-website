import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiGet } from '../utils/api';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

// Default plan for graceful degradation when API fails
const DEFAULT_FREE_PLAN = {
    plan: 'free',
    plan_expires_at: null,
    qr_limit: 5,
    qr_count: 0,
    features: {
        advanced_analytics: false,
        campaigns: false,
        branding: false,
        ab_testing: false,
        scheduling: false,
        csv_export: false,
        svg_pdf_downloads: false
    }
};

// Boot states for proper UI gating
const BOOT_STATE = {
    INITIALIZING: 'initializing',  // App just started, checking session
    AUTHENTICATED: 'authenticated', // User is logged in, data loaded
    UNAUTHENTICATED: 'unauthenticated', // No user session
    DEGRADED: 'degraded' // Auth OK but backend unreachable, using defaults
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user_profile');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [planInfo, setPlanInfo] = useState(() => {
        const savedPlan = localStorage.getItem('plan_info');
        return savedPlan ? JSON.parse(savedPlan) : null;
    });

    // Client-side robustness: ensure effectivePlan is always derived
    const resolveEffectivePlan = (data) => {
        if (!data) return null;
        if (data.effectivePlan) return data.effectivePlan;

        // Fallback for older backend or missing field
        const plan = data.plan || 'free';
        if (data.plan_expires_at) {
            const isExpired = new Date(data.plan_expires_at) <= new Date();
            return isExpired ? 'free' : plan;
        }
        return plan;
    };
    const [bootState, setBootState] = useState(BOOT_STATE.INITIALIZING);
    const [planLoadError, setPlanLoadError] = useState(null);

    // Derived loading state for backward compatibility
    const loading = bootState === BOOT_STATE.INITIALIZING;

    // Fetch plan and profile data with timeout
    const fetchUserData = async (currentToken) => {
        // Use a longer timeout for the initial boot to handle server cold starts (Render/Fly.io)
        const isInitialBoot = bootState === BOOT_STATE.INITIALIZING;
        const TIMEOUT_MS = isInitialBoot ? 60000 : 10000; // 60s for cold start, 10s for normal
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            // Parallel fetch for plan and profile
            const [planPromise, profilePromise] = [
                apiGet('/api/plan', currentToken, { signal: controller.signal }),
                apiGet('/api/users/profile', currentToken, { signal: controller.signal })
            ];

            const planResponse = await planPromise;
            if (planResponse.ok) {
                const planData = await planResponse.json();
                // Ensure effectivePlan exists for components
                const normalizedPlan = {
                    ...planData,
                    effectivePlan: resolveEffectivePlan(planData)
                };
                setPlanInfo(normalizedPlan);
                setPlanLoadError(null);
            } else {
                // Plan API returned error, use default
                console.warn('Plan API returned error, using free defaults');
                setPlanInfo(DEFAULT_FREE_PLAN);
                setPlanLoadError('Plan lookup failed, using free tier defaults');
            }

            // Profile fetch (non-blocking)
            try {
                const profileResponse = await profilePromise;
                if (profileResponse.ok) {
                    const userData = await profileResponse.json();
                    setUser(userData);
                    localStorage.setItem('user_profile', JSON.stringify(userData));
                }
            } catch (profileErr) {
                console.warn('Profile fetch failed (non-critical)', profileErr);
            }

            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('Plan fetch timed out, using free defaults');
                setPlanInfo(DEFAULT_FREE_PLAN);
                setPlanLoadError('Backend timeout, using free tier defaults');
            } else {
                console.error('Error fetching user data:', error);
                setPlanInfo(DEFAULT_FREE_PLAN);
                setPlanLoadError('Network error, using free tier defaults');
            }
            return false;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    // Main auth initialization
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            let currentToken = token;

            try {
                // Check for Supabase session if no local token (e.g. OAuth redirect)
                if (!currentToken) {
                    const { data, error } = await supabase.auth.getSession();
                    if (error) console.error('Error getting session:', error);

                    if (data?.session?.access_token) {
                        currentToken = data.session.access_token;
                        if (isMounted) setToken(currentToken);
                    }
                }

                if (currentToken) {
                    const success = await fetchUserData(currentToken);
                    if (isMounted) {
                        setBootState(success ? BOOT_STATE.AUTHENTICATED : BOOT_STATE.DEGRADED);
                    }
                } else {
                    if (isMounted) {
                        setPlanInfo(null);
                        setUser(null);
                        setBootState(BOOT_STATE.UNAUTHENTICATED);
                    }
                }
            } catch (err) {
                console.error('Critical Auth Initialization Error:', err);
                if (isMounted) {
                    setBootState(BOOT_STATE.DEGRADED);
                    setPlanInfo(DEFAULT_FREE_PLAN);
                }
            }
        };

        initializeAuth();

        return () => { isMounted = false; };
    }, [token]);

    // Supabase Auth Listener (Handles OAuth Redirects)
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.access_token && session.access_token !== token) {
                    setToken(session.access_token);
                    setBootState(BOOT_STATE.INITIALIZING); // Re-trigger fetch
                }
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        });

        return () => subscription.unsubscribe();
    }, [token]);

    // Persist token and basic info to localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user_profile');
            localStorage.removeItem('plan_info');
            setUser(null);
            setPlanInfo(null);
        }
    }, [token]);

    // Persist plan info when it changes
    useEffect(() => {
        if (planInfo) {
            localStorage.setItem('plan_info', JSON.stringify(planInfo));
        }
    }, [planInfo]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setToken(null);
        setUser(null);
        setPlanInfo(null);
        setBootState(BOOT_STATE.UNAUTHENTICATED);
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
                    const normalizedPlan = {
                        ...data,
                        effectivePlan: resolveEffectivePlan(data)
                    };
                    setPlanInfo(normalizedPlan);
                    setPlanLoadError(null);
                }
            } catch (error) {
                console.error('Error refreshing plan info:', error);
            }
        }
    };

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        token,
        planInfo,
        loading,
        bootState,
        planLoadError,
        login,
        logout,
        signInWithGoogle,
        refreshPlan,
        BOOT_STATE
    }), [user, token, planInfo, loading, bootState, planLoadError]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
