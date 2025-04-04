import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, List, Divider } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const { Title, Text } = Typography;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      toast.error("You need to log in to view your cart.");
      navigate("/login");
      return;
    }

    // Decode the token to extract the user ID
    const decodedToken: { id: string; email: string } = jwtDecode(token);
    const userId = decodedToken.id;
    setUserId(userId);

    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/orders/${userId}`
        );
        setOrders(response?.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (!userId) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Title level={3}>Please login to view your orders.</Title>
        <Button
          type="primary"
          onClick={() => navigate("/auth")}
          style={{ marginTop: "1rem", backgroundColor: "#fa541c", borderColor: "#fa541c" }}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Title level={3}>Loading your orders...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2} style={{ color: "#fa541c", marginBottom: "1rem" }}>
        Your Orders
      </Title>
      {orders.length === 0 ? (
        <Text>No past orders found.</Text>
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <Card
              key={order?.id}
              style={{
                marginBottom: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: "1.5rem",
              }}
            >
              <Title level={4} style={{ color: "#fa541c" }}>
                Order #{order?.id}
              </Title>
              <Divider />
              <Text strong>Order Date:</Text>{" "}
              <Text>{new Date(order?.orderDetails?.orderDate).toLocaleDateString()}</Text>
              <br />
              <Text strong>Total Price:</Text>{" "}
              <Text style={{ color: "#52c41a" }}>${order?.orderDetails?.totalPrice}</Text>
              <Divider />
              <Text strong>Pizzas:</Text>
              <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                {order?.orderDetails?.pizzas.map((pizza, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>
                    <Text>
                      {pizza?.quantity}x (
                      {pizza?.ingredients
                        .map((ingredient) => ingredient?.name)
                        .join(", ")}
                      )
                    </Text>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default OrdersPage;