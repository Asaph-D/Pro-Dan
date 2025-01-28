import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Create Context with default values
export const CartContext = createContext({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    totalPrice: 0,
    totalCount: 0,
    totalProducts: 0, // Add totalProducts to the context
    clearCart: () => {},
});

// Create a Provider Component
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(savedCart);
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            setCart([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem("cart", JSON.stringify(cart));
            } catch (error) {
                console.error("Error saving cart to localStorage:", error);
            }
        }
    }, [cart, isLoading]);

    const addToCart = (item) => {
        if (!item.id || typeof item.prix === 'undefined') {
            console.error("Invalid item format:", item);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity: Math.max(0, (cartItem.quantity || 1) + 1)
                          }
                        : cartItem
                );
            }
            return [...prevCart, {
                ...item,
                quantity: 1,
                price: item.prix,
                name: item.nom || item.name  // Handle both French and English naming
            }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        const newQuantity = parseInt(quantity, 10);
        if (isNaN(newQuantity) || newQuantity < 0) {
            console.error("Invalid quantity:", quantity);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(0, newQuantity) }
                    : item
            )
        );
    };

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => {
            const itemPrice = Number(item.price || item.prix) || 0;
            const itemQuantity = Number(item.quantity) || 1;
            return total + (itemPrice * itemQuantity);
        }, 0).toFixed(2);
    }, [cart]);

    const getTotalCount = useCallback(() => {
        return cart.reduce((total, item) => {
            const itemQuantity = Number(item.quantity) || 0;
            return total + itemQuantity;
        }, 0);
    }, [cart]);

    const getTotalProducts = useCallback(() => {
        const uniqueProducts = new Set(cart.map(item => item.id));
        return uniqueProducts.size;
    }, [cart]);

    const clearCart = useCallback(() => {
        setCart([]);
        try {
            localStorage.removeItem("cart");
        } catch (error) {
            console.error("Error clearing cart from localStorage:", error);
        }
    }, []);

    // Memoize derived values for performance
    const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice]);
    const totalCount = useMemo(() => getTotalCount(), [getTotalCount]);
    const totalProducts = useMemo(() => getTotalProducts(), [getTotalProducts]);

    // Don't render children until initial cart is loaded
    if (isLoading) {
        return null; // Or a loading spinner component
    }

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalCount,
        totalProducts, // Include totalProducts in the context value
        clearCart,
        isLoading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
