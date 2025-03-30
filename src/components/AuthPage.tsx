import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Typography, Card, Space } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const AuthPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() === "") {
      toast.error("Username cannot be empty.");
      return;
    }
    login(username);
    toast.success("Logged in successfully!");
    navigate("/");
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
              Please enter your name to start ordering delicious pizzas!
            </Text>
            <Input
              size="large"
              placeholder="Enter your name"
              prefix={<UserOutlined />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={handleLogin}
              block
            >
              Login
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;