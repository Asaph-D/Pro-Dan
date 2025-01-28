import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Conditions d'utilisation</h1>
      <p className="text-gray-600 mb-4">
        Bienvenue sur notre plateforme. En utilisant nos services, vous acceptez de respecter les conditions suivantes :
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Acceptation des conditions</h2>
      <p className="text-gray-600 mb-4">
        En accédant à notre site ou en passant commande, vous acceptez nos conditions générales. Toute violation peut entraîner une suspension de votre compte.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. Offres et récompenses</h2>
      <p className="text-gray-600 mb-4">
        Si vous commandez plusieurs produits, vous avez droit à des cadeaux exclusifs :
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Pour 3 produits achetés : une réduction de 10%.</li>
        <li>Pour 5 produits achetés : un produit gratuit (de même valeur ou inférieur).</li>
      </ul>
      <p className="text-gray-600 mt-4">
        Partagez votre lien personnalisé et recevez des récompenses pour chaque commande passée grâce à votre lien. Les récompenses incluent :
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>5% du montant total des commandes effectuées via votre lien.</li>
        <li>Un cadeau supplémentaire pour 10 commandes générées.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. Utilisation acceptable</h2>
      <p className="text-gray-600 mb-4">
        Vous ne devez pas utiliser notre site à des fins illégales, ni tenter d'exploiter les systèmes de récompenses de manière abusive.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Modification des conditions</h2>
      <p className="text-gray-600 mb-4">
        Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés par email ou notification sur le site.
      </p>

      <p className="text-gray-600 mt-4">
        En cas de questions, veuillez nous contacter à{' '}
        <a href="mailto:support@exemple.com" className="text-blue-600 underline">support@exemple.com</a>.
      </p>
    </div>
  );
};

export default TermsOfUse;
