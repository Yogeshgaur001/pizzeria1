import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

interface Pizza {
  id: number;
  ingredients: string[];
  quantity: number;
}

interface CartContextType {
  cart: Pizza[];
  addToCart: (pizza: Pizza) => Promise<void>; // Updated to return a Promise
  updateCart: (updatedCart: Pizza[]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Pizza[]>([]);

  const addToCart = async (pizza: Pizza) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not authenticated");
      }
  
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;
  
      // Prepare the payload
      const pizzaDetails = pizza.ingredients.reduce((acc, ingredient) => {
        if (typeof ingredient === "object" && ingredient?.name && ingredient?.price) {
          acc[ingredient?.name] = ingredient?.price; // Use the price from the ingredient object
        }
        return acc;
      }, {} as Record<string, string>);
  
      const payload = {
        userId,
        pizzaDetails,
      };
      console.log("Payload to be sent:", payload); // Debug log
  
      // Make the API call
      await axios.post("http://localhost:3000/cart/add", payload);
  
      // Update local state
      setCart((prev) => [...prev, pizza]);
      toast.success("Pizza added to cart!");
    } catch (error) {
      console.error("Error adding pizza to cart:", error);
      toast.error("Failed to add pizza to cart. Please try again later.");
    }
  };

  const updateCart = (updatedCart: Pizza[]) => setCart(updatedCart);
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not authenticated");
      }
  
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;
  
      // Make the API call to delete the cart
      await axios.delete(`http://localhost:3000/cart/delete/${userId}`);
  
      // Clear the local cart state
      setCart([]);
      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear the cart. Please try again later.");
    }
  };

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