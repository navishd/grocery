import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/cart', config);
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const addToCart = async (productId, qty) => {
    if (!user) {
      alert('Please login to add to cart');
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post('/api/cart', { productId, qty }, config);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart', error);
      alert('Could not add to cart. Please try again.');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.delete(`/api/cart/${productId}`, config);
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Failed to remove item', error);
      alert('Could not remove item. Please try again.');
    }
  };

  const clearCart = async () => {
     if (!user) return;
     try {
       const config = {
         headers: { Authorization: `Bearer ${user.token}` },
       };
       await axios.delete('/api/cart', config);
       setCartItems([]);
     } catch (error) {
       console.error('Failed to clear cart', error);
       alert('Could not clear cart. Please try again.');
     }
  }

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
