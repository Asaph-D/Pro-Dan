import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import './styles.css';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import CakesPage from './pages/CakesPage';
import BeveragesPage from './pages/BeveragesPage';
import GiftsPage from './pages/GiftsPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import ProductList from './pages/ProductList';
import { CartProvider } from './context/CartContext';
import PatisserieLogin from './pages/PatisserieLogin';
import ForgotPassword from './pages/ForgotPassword';
import PatisserieSignup from './pages/PatisserieSignup';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PaymentService from './pages/PaymentService';
import { AuthProvider } from './Auth/AuthContext';
import AdminRoutes from './pages/patissière/DashboardLayout';
import { ThemeProvider } from './context/ThemeContext';
import ConfirmationPage from './pages/ConfirmationPage';

const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <CartProvider>
                    <ThemeProvider>
                        <Layout>
                            <Outlet />
                        </Layout>
                    </ThemeProvider>
                </CartProvider>
            </AuthProvider>
        ),
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/cakes", element: <CakesPage /> },
            { path: "/beverages", element: <BeveragesPage /> },
            { path: "/gifts", element: <GiftsPage /> },
            { path: "/cart", element: <CartPage /> },
            { path: "/products", element: <ProductList /> },
            { path: "/login", element: <PatisserieLogin /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/signup", element: <PatisserieSignup /> },
            { path: "/terms", element: <TermsOfUse /> },
            { path: "/policy", element: <PrivacyPolicy /> },
            { path: "/admin/*", element: <AdminRoutes /> },
            { path: "/payment", element: <PaymentService /> },
            { path: "/confirmation", element: <ConfirmationPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
