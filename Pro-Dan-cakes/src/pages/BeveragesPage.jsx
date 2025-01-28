import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { AuthContext } from '../Auth/AuthContext';

const BeveragesPage = () => {
    const { authToken } = useContext(AuthContext);
    const [products, setProducts] = useState([]);

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
            setProducts(data.filter(product => product.category === 'juice'));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold text-orange-800 mb-8">Nos Boissons</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.nom}
                        description={product.description}
                        imageSrc={`http://localhost:8081${product.image}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BeveragesPage;
