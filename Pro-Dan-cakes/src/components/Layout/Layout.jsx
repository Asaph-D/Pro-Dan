import React, { useContext, useState } from 'react';
import styles from './Layout.module.css';
import { Link } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../Auth/AuthContext';
import {
  Phone,
  MapPin,
  Home,
  Cake,
  Coffee,
  Gift,
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role, isLoggedIn, logout, error } = useContext(AuthContext);
  const { totalProducts } = useCart();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    // navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/cakes', label: 'Gâteaux', icon: Cake },
    { path: '/beverages', label: 'Boissons', icon: Coffee },
    { path: '/gifts', label: 'Cadeaux', icon: Gift },
    { path: '/products', label: 'Commander', icon: ShoppingBag },
  ];

  if (role === 'ADMIN') {
    navLinks.push({ path: '/admin', label: 'Dashboard', icon: LayoutDashboard });
  }

  if (error) {
    return <div>Error: {error}</div>; // Afficher le message d'erreur
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.title}>Pro Dan Cakes</h1>
          {/* Hamburger Icon */}
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          </button>
          {/* Navigation Links */}
          <div
            className={`${styles.navLinks} ${
              menuOpen ? styles.navLinksOpen : ''
            }`}
          >
            <Link to="/" onClick={toggleMenu}>
              Accueil
            </Link>
            <Link to="/cakes" onClick={toggleMenu}>
              Gâteaux
            </Link>
            <Link to="/beverages" onClick={toggleMenu}>
              Boissons
            </Link>
            <Link to="/gifts" onClick={toggleMenu}>
              Cadeaux
            </Link>
            <Link to="/products" onClick={toggleMenu}>
              Commander
            </Link>

            {/* Admin-specific links */}
            {role === "ADMIN" && (
              <Link to="/admin" onClick={toggleMenu}>
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className={styles.contactBar}>
        <Link to="/cart" className="flex items-center text-sm hover:text-gray-900 hover:text-decoration-none">
          <ShoppingCartIcon className="h-6 w-6 mr-2" />
          <span className="relative top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalProducts} {/* Use totalProducts directly */}
          </span>
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" className="flex items-center text-sm hover:text-gray-900 hover:text-decoration-none">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
            {/* Se connecter */}
          </Link>
        ) : (
          <Link to="/" onClick={handleLogout} className="flex items-center text-sm hover:text-gray-900 hover:text-decoration-none">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
            {/* Se déconnecter */}
          </Link>
        )}
      </div>
      {children}
      <div className={styles.contactBar}>
        <div className={styles.contactInfo}>
            <span>
                <span role="img" aria-label="telephone">📞</span>
                {" +237 690 282 207"}
            </span>
            <span>
                <span role="img" aria-label="telephone">📞</span>
                {" +237 672 377 858"}
            </span>
        </div>
        <div className={styles.location}>
            <span>
                <span role="img" aria-label="location pin">📍</span>
                {" Ouest | Littorale"}
            </span>
        </div>
      </div>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Pro Dan Cakes</h2>
              <p className="text-gray-400">Votre pâtisserie artisanale de confiance</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +237 690 282 207
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +237 672 377 858
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ouest | Littorale
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Pro Dan Cakes. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
