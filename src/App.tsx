import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import CartPage from "./components/Cart";
import OrdersPage from "./components/Orders";
import AuthPage from "./components/Auth";
import Navbar from "./components/Navbar";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;