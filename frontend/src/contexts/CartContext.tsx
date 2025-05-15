import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import axios from "axios";
const API_BASE = "http://localhost:5600/api/carts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  restaurantId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Always get token from localStorage
  const getToken = () => localStorage.getItem("foodFusionToken");

  // Fetch cart if token is present
  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setItems([]);
      setRestaurantId(null);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data.items)) {
        handleCartUpdate(response.data.items);
      } else if (Array.isArray(response.data)) {
        handleCartUpdate(response.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      setItems([]);
      setRestaurantId(null);
      console.error('Cart fetch error:', error);
    }
  };

  // Listen for storage changes (login/logout from other tabs)
  useEffect(() => {
    fetchCart();
    const handleStorageChange = () => fetchCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCartUpdate = (newItems: CartItem[]) => {
    setItems(newItems || []);
    setRestaurantId(newItems && newItems[0]?.restaurantId || null);
  };

  // Helper for all cart API requests
  const cartRequest = async (
    method: 'post'|'put'|'delete',
    endpoint: string,
    data?: any
  ) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to perform this action");
      throw new Error("No token available");
    }
    try {
      const response = await axios({
        method,
        url: `${API_BASE}${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
        data
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Session expired - please login again");
        setItems([]);
        setRestaurantId(null);
        window.dispatchEvent(new Event("storage"));
      }
      throw error;
    }
  };

  // Add item to cart
  const addItem = async (item: MenuItem, quantity = 1) => {
    try {
      const data = await cartRequest('post', '/add', { item, quantity });
      handleCartUpdate(data.items || data);
      toast.success(`${quantity}x ${item.name} added to cart`);
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data.requiresConfirmation) {
        toast("Cart contains items from another restaurant. Clear cart?", {
          action: {
            label: "Clear and add",
            onClick: async () => {
              try {
                await cartRequest('delete', '/clear');
                const data = await cartRequest('post', '/add', { item, quantity });
                handleCartUpdate(data.items || data);
                toast.success(`${quantity}x ${item.name} added to cart`);
              } catch (err) {
                toast.error("Failed to update cart");
              }
            },
          },
        });
      } else {
        toast.error("Failed to add item to cart");
      }
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const data = await cartRequest('delete', `/remove/${itemId}`);
      handleCartUpdate(data.items || data);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const data = await cartRequest('put', `/update/${itemId}`, { quantity });
      handleCartUpdate(data.items || data);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await cartRequest('delete', '/clear');
      handleCartUpdate([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const getCartTotal = () => items.reduce((t, i) => t + i.price * i.quantity, 0);
  const getItemCount = () => items.reduce((c, i) => c + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount,
      restaurantId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
