import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, Card, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      toast.error("Email and password cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }
  
      const data = await response.json();
      const token = data.token; // Assuming the server returns a token in the response
  
      // Store the token in localStorage
      localStorage.setItem("authToken", token);
  
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "An error occurred during login.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        background: "url('../public/image.png') center/cover no-repeat",
      }}
    >
      {/* Black overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Black overlay with transparency
          zIndex: 1,
        }}
      ></div>

      {/* Login modal */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2, // Ensure it appears above the overlay
        }}
      >
        <Card
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2} style={{ color: "#fa541c" }}>
              Welcome to Pizzeria
            </Title>
            <Text type="secondary" style={{ color: "#555" }}>
              Please enter your details to start ordering delicious pizzas!
            </Text>
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<UserOutlined />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={handleLogin}
              block
            >
              Login
            </Button>
            <Text type="secondary" style={{ marginTop: "10px" }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </Text>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;