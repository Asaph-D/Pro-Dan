import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/api/auth/reset-password-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message || 'Erreur lors de l\'envoi de l\'email.');
                return;
            }

            const data = await response.json();
            setMessage('Un email de réinitialisation a été envoyé.');
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            setMessage('Erreur lors de la requête. Veuillez réessayer plus tard.');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez votre email"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Réinitialiser le mot de passe
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default ForgotPassword;
