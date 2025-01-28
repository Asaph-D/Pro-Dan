import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';

const ProductList = () => {
    const { addToCart } = useCart();
    const { authToken } = useContext(AuthContext);

    const [products, setProducts] = useState([]);
    const [orderCounts, setOrderCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [sortField, setSortField] = useState('nom');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/produits', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setProducts(data.filter(product => product.category !== 'gift'));
            setOrderCounts(
                data.reduce((acc, product) => {
                    acc[product.id] = 0;
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);

        // Met à jour le compteur
        setOrderCounts((prevCounts) => ({
            ...prevCounts,
            [product.id]: prevCounts[product.id] + 1,
        }));
    };

    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.nom && product.nom.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            if (sortField === 'prix') {
                return direction * ((a.prix ?? 0) - (b.prix ?? 0));
            }
            return direction * (a[sortField] ?? '').localeCompare(b[sortField] ?? '');
        });

    return (
        <div className="p-8">
            <div className="flex flex-wrap gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="cake">Cake</option>
                        <option value="juice">Juice</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                    <ArrowUpDown className="text-gray-400 w-5 h-5" />
                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="nom">Name</option>
                        <option value="prix">Price</option>
                    </select>
                    <select
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden group"
                        style={{
                            backgroundImage: `url(http://localhost:8081${product.image})`,
                            height: '300px',
                        }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition duration-300"></div>

                        <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
                            {/* Nom du produit */}
                            <h3 className="text-xl font-bold mb-2">{product.nom}</h3>

                            {/* Prix */}
                            <p className="text-lg font-medium">{product.prix} €</p>

                            {/* Bouton et compteur */}
                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded transition"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Ajouter au panier
                                </button>
                                <span className="bg-gray-800 text-sm py-1 px-3 rounded">
                                    Commandé : {orderCounts[product.id]} fois
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
