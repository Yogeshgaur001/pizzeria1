import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, List } from "antd";

const { Title, Text } = Typography;

const OrdersPage = () => {
  const { user, orders } = useAuth();
  const navigate = useNavigate();

  if (!user) {
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
          renderItem={(order, index) => (
            <Card
              key={index}
              style={{
                marginBottom: "1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={4}>Order #{index + 1}</Title>
              <Text>
                Pizzas:{" "}
                {order.pizzas
                  .map((pizza) => pizza.ingredients.join(", "))
                  .join("; ")}
              </Text>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default OrdersPage;