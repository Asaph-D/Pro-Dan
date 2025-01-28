import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Context with default values
export const AuthContext = createContext({
    authToken: null,
    isLoggedIn: false,
    email: null,
    role: null,
    login: () => {},
    logout: () => {},
    error: null,
});

// Create a Provider Component
export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [email, setEmail] = useState(localStorage.getItem('email') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Logout handler
    const logout = useCallback(() => {
        setAuthToken(null);
        setEmail(null);
        setIsLoggedIn(false);
        setRole(null);
        setError(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
    }, [navigate]);

    // Fetch user role and set the highest priority role
    const fetchUserRole = useCallback(async (email) => {
        try {
            const response = await fetch(`http://localhost:8081/api/auth/get-user-role?email=${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const highestRole = data.reduce((acc, current) => {
                    const rolePriority = { ADMIN: 2, USER: 1 };
                    return rolePriority[current.name] > rolePriority[acc] ? current.name : acc;
                }, 'USER');
                setRole(highestRole);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch user role:', errorText);
                setError('Failed to fetch user role');
            }
        } catch (err) {
            console.error('Error fetching user role:', err);
            setError('Error fetching user role');
        }
    }, [authToken]);

    // Validate the token on component mount
    const checkTokenValidity = useCallback(async () => {
        if (authToken) {
            try {
                const response = await fetch('http://localhost:8081/api/auth/validate-token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.warn('Token is invalid or expired, logging out...');
                    logout();
                }
            } catch (err) {
                console.error('Error validating token:', err);
                logout();
            }
        }
    }, [authToken, logout]);

    useEffect(() => {
        checkTokenValidity();
    }, [authToken, checkTokenValidity]);

    // Trigger fetching user role when email and token are available
    useEffect(() => {
        if (authToken && email) {
            fetchUserRole(email);
        }
    }, [authToken, email, fetchUserRole]);

    // Login handler
    const login = (email, token) => {
        setAuthToken(token);
        setEmail(email);
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        fetchUserRole(email);
        // navigate('/'); // Redirect to home page after login
    };

    // Log auth state changes
    useEffect(() => {
        console.log('Auth state updated:', { authToken, email, isLoggedIn, role });
    }, [authToken, email, isLoggedIn, role]);

    return (
        <AuthContext.Provider value={{ authToken, isLoggedIn, email, role, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}
