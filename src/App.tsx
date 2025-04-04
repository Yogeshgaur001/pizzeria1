import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Components/HomePage";
import CartPage from "./Components/CartPage";
import OrdersPage from "./Components/OrdersPage";
import AuthPage from "./Components/AuthPage";
import Navbar from "./Components/Navbar";
import ErrorPage from "./Components/ErrorPage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./Components/LoginPage";

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/register", "/login"]; // Add routes where Navbar should be hidden

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Toaster position="top-right" />
      <div style={{ paddingTop: hideNavbarRoutes.includes(location.pathname) ? "0" : "64px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;