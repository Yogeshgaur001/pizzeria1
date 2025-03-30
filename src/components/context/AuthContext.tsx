import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
}

interface Order {
  pizzas: { ingredients: string[] }[];
}

interface AuthContextType {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = (name: string) => setUser({ name });
  const logout = () => {
    setUser(null);
    setOrders([]);
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
