import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, isLoading } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (itemId, value) => {
        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity >= 0) {
            updateQuantity(itemId, quantity);
        }
    };

    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate('/payment');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mon Panier</h1>
            {cart.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Votre panier est vide.</p>
                    <button
                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Continuer vos achats
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200">Produit</th>
                                    <th className="px-6 py-3 border-b border-gray-200">Quantité</th>
                                    <th className="px-6 py-3 border-b border-gray-200">Prix</th>
                                    <th className="px-6 py-3 border-b border-gray-200">Total</th>
                                    <th className="px-6 py-3 border-b border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cart.map((item) => {
                                    const itemPrice = Number(item.price || item.prix) || 0;
                                    const itemQuantity = Number(item.quantity) || 1;
                                    const itemTotal = (itemPrice * itemQuantity).toFixed(2);

                                    return (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {item.image && (
                                                        <img
                                                            src={`http://localhost:8081${item.image}`}
                                                            alt={item.name || item.nom}
                                                            className="w-16 h-16 object-cover mr-4 rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.name || item.nom}
                                                        </div>
                                                        {item.description && (
                                                            <div className="text-sm text-gray-500">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={itemQuantity}
                                                    onChange={(e) => 
                                                        handleQuantityChange(item.id, e.target.value)
                                                    }
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {itemPrice.toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {itemTotal} €
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="text-red-600 hover:text-red-800 transition-colors font-medium"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right font-bold">
                                        Total :
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {totalPrice} €
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <button
                            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            onClick={() => navigate('/products')}
                        >
                            Continuer vos achats
                        </button>
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={handleCheckout}
                        >
                            Passer commande
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;