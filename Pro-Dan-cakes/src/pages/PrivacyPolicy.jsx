import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de confidentialité</h1>
      <p className="text-gray-600 mb-4">
        Votre vie privée est importante pour nous. Voici comment nous collectons, utilisons et protégeons vos données.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Collecte des informations</h2>
      <p className="text-gray-600 mb-4">
        Nous collectons les informations suivantes lorsque vous utilisez notre site :
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Nom, adresse email, et numéro de téléphone lors de l'inscription.</li>
        <li>Historique des commandes et interactions avec notre site.</li>
        <li>Adresse IP et cookies pour améliorer votre expérience utilisateur.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. Utilisation des données</h2>
      <p className="text-gray-600 mb-4">
        Les données collectées sont utilisées pour :
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Traiter vos commandes et vous informer de leur statut.</li>
        <li>Envoyer des offres personnalisées, y compris les cadeaux pour commandes multiples.</li>
        <li>Suivre les partages de lien pour attribuer les récompenses.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. Partage des données</h2>
      <p className="text-gray-600 mb-4">
        Vos informations ne seront jamais vendues à des tiers. Cependant, nous pouvons partager vos données avec des partenaires logistiques pour la livraison de vos produits.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Sécurité</h2>
      <p className="text-gray-600 mb-4">
        Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">5. Vos droits</h2>
      <p className="text-gray-600 mb-4">
        Vous avez le droit de consulter, modifier ou supprimer vos données personnelles en nous contactant à{' '}
        <a href="mailto:support@exemple.com" className="text-blue-600 underline">support@exemple.com</a>.
      </p>

      <p className="text-gray-600 mt-4">
        Pour toute question, veuillez nous contacter. Nous sommes là pour vous aider !
      </p>
    </div>
  );
};

export default PrivacyPolicy;
