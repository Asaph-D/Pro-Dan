import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { AuthContext } from '../Auth/AuthContext';
import { Cake, Coffee, Gift } from 'lucide-react';

const GrainEffect = () => (
  <div className="fixed inset-0 opacity-20 pointer-events-none">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=')]"
      style={{ animation: 'grain 8s steps(1) infinite' }}
    />
  </div>
);

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-float-slow">
      <div className="absolute w-64 h-64 bg-orange-200 rounded-full opacity-10 blur-3xl" />
    </div>
    <div className="absolute top-1/4 -right-1/4 w-full h-full animate-float-slower">
      <div className="absolute w-96 h-96 bg-orange-100 rounded-full opacity-10 blur-3xl" />
    </div>
  </div>
);

const HomePage = () => {
    const { authToken } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);

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
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 relative">
            <GrainEffect />
            
            {/* Hero Section */}
            <div className="relative bg-orange-100 text-orange-900 py-16 md:py-24 overflow-hidden">
                <FloatingShapes />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-orange-800 animate-fade-in">
                            Pro-Dan-Cakes
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-orange-700 animate-slide-up">
                            Une pâtisserie artisanale où la passion et le savoir-faire se marient délicieusement. 
                            Dans notre atelier, chaque création est une ode à la gourmandise, alliant tradition 
                            française et créativité contemporaine.
                        </p>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-16 container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Cake, title: "Gâteaux Artisanaux", desc: "Des créations uniques pour vos moments spéciaux" },
                        { icon: Coffee, title: "Boissons", desc: "Une sélection raffinée de boissons" },
                        { icon: Gift, title: "Cadeaux", desc: "Des surprises gourmandes à offrir" }
                    ].map((service, idx) => (
                        <div 
                            key={idx}
                            className="group bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <service.icon 
                                className={`w-12 h-12 mx-auto mb-4 text-orange-400 transition-transform duration-300 ${
                                    hoveredCard === idx ? 'scale-110' : ''
                                }`}
                            />
                            <h3 className="text-xl font-semibold mb-2 text-center text-orange-800">{service.title}</h3>
                            <p className="text-gray-600 text-center">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Products Section */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <h2 className="text-3xl font-bold text-orange-800 mb-8">Nos Produits Populaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
                        >
                            <ProductCard
                                title={product.nom}
                                description={product.description}
                                imageSrc={`http://localhost:8081${product.image}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-white/80 backdrop-blur-sm py-16 relative">
                <FloatingShapes />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-orange-800 mb-4">
                        Envie de découvrir nos créations ?
                    </h2>
                    <p className="text-lg text-orange-700 mb-8">
                        Venez nous rendre visite ou passez votre commande en ligne
                    </p>
                    <button className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        Commander maintenant
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0) }
                    10% { transform: translate(-5%, -5%) }
                    20% { transform: translate(-10%, 5%) }
                    30% { transform: translate(5%, -10%) }
                    40% { transform: translate(-5%, 15%) }
                    50% { transform: translate(-10%, 5%) }
                    60% { transform: translate(15%, 0) }
                    70% { transform: translate(0, 10%) }
                    80% { transform: translate(-15%, 0) }
                    90% { transform: translate(10%, 5%) }
                }

                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(2%, 2%) rotate(5deg); }
                    50% { transform: translate(-2%, 4%) rotate(-5deg); }
                    75% { transform: translate(-4%, -2%) rotate(5deg); }
                }

                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-2%, -2%) rotate(-5deg); }
                    50% { transform: translate(2%, -4%) rotate(5deg); }
                    75% { transform: translate(4%, 2%) rotate(-5deg); }
                }

                .animate-float-slow {
                    animation: float-slow 20s ease-in-out infinite;
                }

                .animate-float-slower {
                    animation: float-slower 25s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fadeIn 1s ease-out;
                }

                .animate-slide-up {
                    animation: slideUp 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default HomePage;