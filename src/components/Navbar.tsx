import React from "react";
import { Menu, Layout, Badge } from "antd";
import { ShoppingCartOutlined, HomeOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Header style={{ backgroundColor: "#fa541c", position: "fixed", zIndex: 1, width: "100%" }}>
      <div
        style={{
          float: "left",
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Pizzeria
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ backgroundColor: "#fa541c", justifyContent: "flex-end" }}
        selectable={false}
      >
        <Menu.Item
          key="home"
          icon={<HomeOutlined />}
          onClick={() => navigate("/")}
          style={{ color: "#fff" }}
        >
          Home
        </Menu.Item>
        <Menu.Item
          key="cart"
          icon={
            <Badge count={cart.length} offset={[10, 0]} style={{ backgroundColor: "#fff", color: "#fa541c" }}>
              <ShoppingCartOutlined />
            </Badge>
          }
          onClick={() => navigate("/cart")}
          style={{ color: "#fff" }}
        >
          Cart
        </Menu.Item>
        <Menu.Item
          key="orders"
          icon={<FileTextOutlined />}
          onClick={() => navigate("/orders")}
          style={{ color: "#fff" }}
        >
          Orders
        </Menu.Item>
        <Menu.Item
          key="auth"
          icon={<UserOutlined />}
          onClick={() => handleLogout()}
          style={{ color: "#fff" }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;