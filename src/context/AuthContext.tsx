import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

interface User {
  id: number; // Optional ID for the user
  email: string;
  password: string; // Store password temporarily (not recommended for production)
}

interface Order {
  pizzas: { ingredients: string[] }[];
}

interface AuthContextType {
  user: User | null;
  login: (id: string, email: string, password: string) => void;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Add initial orders for demonstration
  const [orders, setOrders] = useState<Order[]>([
    {
      pizzas: [
        { ingredients: ["Cheese", "Pepperoni"] },
        { ingredients: ["Mushrooms", "Olives"] },
      ],
    },
    {
      pizzas: [
        { ingredients: ["Cheese", "Tomatoes"] },
        { ingredients: ["Basil", "Mozzarella"] },
      ],
    },
  ]);

  const login = (id: string, email: string, password: string) => setUser({ id, email, password });
  const logout = async () => {
    try {
      // Call the logout API
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Clear user and orders state
      setUser(null);
      setOrders([]);
  
      // Clear authToken from localStorage
      localStorage.removeItem("authToken");
  
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const addOrder = (order: Order) => setOrders((prev) => [...prev, order]);

  return (
    <AuthContext.Provider value={{ user, login, logout, orders, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};