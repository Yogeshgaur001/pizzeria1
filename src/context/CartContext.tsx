import { createContext, useContext, useState, ReactNode } from "react";

interface Pizza {
  id: number;
  ingredients: string[];
  quantity: number; // Added quantity property
}

interface CartContextType {
  cart: Pizza[];
  addToCart: (pizza: Pizza) => void;
  updateCart: (updatedCart: Pizza[]) => void; // Added updateCart function
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Pizza[]>([]);

  const addToCart = (pizza: Pizza) => setCart((prev) => [...prev, pizza]);
  const updateCart = (updatedCart: Pizza[]) => setCart(updatedCart); // Function to update cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};