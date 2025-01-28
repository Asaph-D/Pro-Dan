import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { jwtDecode } from 'jwt-decode';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PatisserieSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        adresse: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [missingInfo, setMissingInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGoogleResponse = useCallback(async (response) => {
        const userObject = jwtDecode(response.credential);
        console.log('reponse de google', response.credential);

        const userData = {
            nom: userObject.name,
            email: userObject.email,
            provider: 'google',
            providerId: userObject.sub,
            roles: { name: 'USER' }
        };

        // Check for missing information
        const requiredFields = ['motDePasse', 'telephone', 'adresse'];
        const missingFields = requiredFields.filter(field => !userObject[field]);

        if (missingFields.length > 0) {
            setMissingInfo({ userData, missingFields });
            setIsModalOpen(true);
        } else {
            await submitUserData(userData);
        }
    }, [navigate, setErrors]);

    const submitUserData = async (userData) => {
        try {
            const response = await fetch('http://localhost:8081/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                navigate('/login', {
                    state: { message: 'Inscription avec Google réussie. Veuillez vous connecter.' }
                });
            } else {
                setErrors({
                    submit: "Une erreur s'est produite lors de l'inscription avec Google."
                });
            }
        } catch (error) {
            setErrors({
                submit: "Une erreur s'est produite. Veuillez réessayer."
            });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const additionalInfo = {
            motDePasse: formData.get('motDePasse'),
            telephone: formData.get('telephone'),
            adresse: formData.get('adresse'),
        };

        const completeUserData = { ...missingInfo.userData, ...additionalInfo };
        await submitUserData(completeUserData);
        setIsModalOpen(false);
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

    const validateForm = () => {
        const newErrors = {};

        // Validation du nom
        if (!formData.nom) {
            newErrors.nom = "Le nom est obligatoire.";
        } else if (formData.nom.length < 2 || formData.nom.length > 50) {
            newErrors.nom = "Le nom doit comporter entre 2 et 50 caractères.";
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "L'email est obligatoire.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Veuillez fournir une adresse email valide.";
        }

        // Validation du mot de passe
        if (!formData.motDePasse) {
            newErrors.motDePasse = "Le mot de passe est obligatoire.";
        } else if (formData.motDePasse.length < 6) {
            newErrors.motDePasse = "Le mot de passe doit comporter au moins 6 caractères.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8081/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    roles: { name: "ADMIN" }
                }),
            });

            if (response.ok) {
                navigate('/login', {
                    state: { message: 'Inscription réussie. Veuillez vous connecter.' }
                });
            } else {
                setErrors({
                    submit: "Une erreur s'est produite lors de l'inscription."
                });
            }
        } catch (error) {
            setErrors({
                submit: "Une erreur s'est produite. Veuillez réessayer."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({
            ...prev,
            telephone: value
        }));
    };

    const handleVideo = (videoUrl) => {
        setCurrentVideo(videoUrl);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setCurrentVideo(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMissingInfo(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Left side - Signup Form */}
                <div className="p-8">
                    <div className="mb-8">
                        <img src="/logo/Groupe.png" alt="Logo Pâtisserie" className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Créer un compte</h2>
                    <p className="text-gray-500 mb-8">Rejoignez notre communauté de pâtissiers</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.nom ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Votre nom"
                            />
                            {errors.nom && (
                                <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Votre email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                name="motDePasse"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.motDePasse ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Mot de passe"
                            />
                            {errors.motDePasse && (
                                <p className="mt-1 text-sm text-red-500">{errors.motDePasse}</p>
                            )}
                        </div>

                        <div>
                            <PhoneInput
                                country={'fr'}
                                value={formData.telephone}
                                onChange={handlePhoneChange}
                                inputClass="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Numéro de téléphone (facultatif)"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Adresse (facultative)"
                            />
                        </div>

                        {errors.submit && (
                            <p className="text-red-500 text-sm">{errors.submit}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
                        </button>

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

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            Déjà inscrit ? Se connecter
                        </button>
                    </form>
                </div>

                {/* Right side - Gradient Background with Content */}
                <div className="hidden md:block relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
                    <div className="absolute top-4 right-4">
                        <button className="px-4 py-1 bg-white bg-opacity-20 rounded-full text-black text-sm">
                            Masquer
                        </button>
                    </div>
                    <div className="h-full flex flex-col justify-center text-white">
                        <h2 className="text-3xl font-semibold mb-4">Pourquoi nous rejoindre ?</h2>
                        <p className="mb-8">Devenez membre de notre communauté de pâtissiers passionnés et partagez vos créations avec le monde.</p>
                        <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-black" onClick={() => handleVideo('/video/WhatsApp Vidéo 2024-12-25 à 19.14.29_119e4ffe.mp4')}>▶</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="relative bg-black p-4">
                        <button
                            className="absolute top-2 right-2 text-white hover:text-gray-300"
                            onClick={closeLightbox}
                        >
                            X
                        </button>
                        <ReactPlayer url={currentVideo} playing controls />
                    </div>
                </div>
            )}

            {/* Modal for Missing Information */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Complétez vos informations</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {missingInfo.missingFields.includes('motDePasse') && (
                                <div>
                                    <input
                                        type="password"
                                        name="motDePasse"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Mot de passe"
                                        required
                                    />
                                </div>
                            )}
                            {missingInfo.missingFields.includes('telephone') && (
                                <div>
                                    <PhoneInput
                                        country={'fr'}
                                        inputClass="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Numéro de téléphone"
                                        required
                                    />
                                </div>
                            )}
                            {missingInfo.missingFields.includes('adresse') && (
                                <div>
                                    <input
                                        type="text"
                                        name="adresse"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Adresse"
                                        required
                                    />
                                </div>
                            )}
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

export default PatisserieSignup;
