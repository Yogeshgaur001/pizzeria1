import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  List,
  Divider,
  Spin,
  Tag,
  Descriptions,
  Row,
  Col,
  Empty,
} from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
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
      toast.error("You need to log in to view your orders.");
      navigate("/login");
      return;
    }

    const decodedToken: { id: string; email: string } = jwtDecode(token);
    const userId = decodedToken.id;
    setUserId(userId);

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
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <Spin tip="Loading your orders..." size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <Title level={2} style={{ color: "#fa541c", marginBottom: "2rem" }}>
        Your Orders
      </Title>

      {orders.length === 0 ? (
        <Empty description="No past orders found." />
      ) : (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={orders}
          renderItem={(order) => (
            <Card
              key={order?.id}
              bordered={false}
              style={{
                marginBottom: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Order #{order?.id}
                  </Title>
                </Col>
                <Col>
                  <Text type="secondary">
                    {new Date(order?.orderDetails?.orderDate).toLocaleString()}
                  </Text>
                </Col>
              </Row>

              <Divider />

              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Total Price">
                  <Text strong style={{ color: "#52c41a" }}>
                    ${order?.orderDetails?.totalPrice}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Pizzas">
                  {order?.orderDetails?.pizzas.map((pizza, index) => (
                    <div
                      key={index}
                      style={{ marginBottom: "1rem", paddingLeft: "0.5rem" }}
                    >
                      <Text strong>{pizza?.quantity}x Pizza</Text>
                      <div style={{ marginTop: "0.5rem" }}>
                        {pizza?.ingredients.map((ingredient, i) => (
                          <Tag color="volcano" key={i}>
                            {ingredient?.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default OrdersPage;
