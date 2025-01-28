import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { AuthContext } from '../Auth/AuthContext';
import { jwtDecode } from 'jwt-decode';

const PatisserieLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoggedIn, role } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [googleUserData, setGoogleUserData] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            if (role === "ADMIN") {
                navigate('/admin');
            }
            navigate('/');
        }
    }, [isLoggedIn, role, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    motDePasse: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log(email);
                console.log(data.token);

                login(email, data.token);
                setError('');
            } else {
                setError('Email ou mot de passe incorrect.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Une erreur s\'est produite. Veuillez réessayer.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleVideo = (videoUrl) => {
        setCurrentVideo(videoUrl);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setCurrentVideo(null);
    };

    const handleGoogleResponse = useCallback(async (response) => {
        const userObject = jwtDecode(response.credential);
        console.log('réponse de google', response.credential);

        const userData = {
            email: userObject.email,
            provider: 'google',
            providerId: userObject.sub,
        };

        setGoogleUserData(userData);
        setIsModalOpen(true);
    }, []);

    const handleGoogleLoginSubmit = async (e) => {
        e.preventDefault();
        const { email, provider, providerId } = googleUserData;
        const rawPassword = e.target.rawPassword.value;

        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    motDePasse: rawPassword,
                    provider,
                    providerId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                login(email, data.token);
                setError('');
                setIsModalOpen(false);
            } else {
                setError('Une erreur s\'est produite lors de la connexion avec Google.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Une erreur s\'est produite. Veuillez réessayer.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGoogleUserData(null);
    };

    useEffect(() => {
        // Load Google Sign-In SDK
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                window.google.accounts.id.initialize({
                    client_id: '42184171661-g0hnrv7bbbou223opl6prnpbkl4smu54.apps.googleusercontent.com',
                    callback: handleGoogleResponse
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignIn'),
                    { theme: 'outline', size: 'large', width: 300 }
                );
            };
        };

        loadGoogleScript();
    }, [handleGoogleResponse]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Left side - Login Form */}
                <div className="p-8">
                    <div className="mb-8">
                        <img src="/logo/Groupe.png" alt="Logo Pâtisserie" className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bienvenue</h2>
                    <p className="text-gray-500 mb-8">Connectez-vous à votre compte pâtissier</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Adresse email"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Mot de passe"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-purple-500" />
                                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-purple-600 hover:underline"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
                            >
                                Se connecter
                            </button>
                            <button
                                type="button"
                                onClick={handleSignup}
                                className="w-full py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                S'inscrire
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Ou continuer avec
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            <div id="googleSignIn" className="mt-4"></div>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        En vous connectant, vous acceptez nos{' '}
                        <button onClick={() => navigate('/terms')} className="text-purple-600 hover:underline cursor-pointer">Conditions d'utilisation</button>
                        {' '}et{' '}
                        <button onClick={() => navigate('/policy')} className="text-purple-600 hover:underline cursor-pointer">Politique de confidentialité</button>
                    </p>
                </div>

                {/* Right side - Gradient Background with Content */}
                <div className="hidden md:block relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
                    <div className="absolute top-4 right-4">
                        <button className="px-4 py-1 bg-white bg-opacity-20 rounded-full text-black text-sm">
                            Masquer
                        </button>
                    </div>
                    <div className="h-full flex flex-col justify-center text-white">
                        <h2 className="text-3xl font-semibold mb-4">Comment ça marche ?</h2>
                        <p className="mb-8">Créez votre profil de pâtissier et découvrez toutes les fonctionnalités disponibles.</p>
                        <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span onClick={() => handleVideo('/video/VID-20250101-WA0001.mp4')} className="text-black">▶</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
                    <div className="relative bg-black p-4">
                        <button
                            className="absolute top-2 right-2 text-white"
                            onClick={closeLightbox}
                        >
                            X
                        </button>
                        <ReactPlayer url={currentVideo} playing controls />
                    </div>
                </div>
            )}

            {/* Modal for Google Login Password */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Entrez votre mot de passe</h2>
                        <form onSubmit={handleGoogleLoginSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="password"
                                    name="rawPassword"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Mot de passe"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
                            >
                                Soumettre
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="mt-4 w-full py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatisserieLogin;
