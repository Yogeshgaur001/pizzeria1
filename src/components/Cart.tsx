import { useCart } from "./context/CartContext";
import { Button, Card, Typography, Row, Col, Divider, InputNumber } from "antd";
import { useAuth } from "./context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CartPage = () => {
  const { cart, updateCart, clearCart } = useCart(); // Add updateCart function to modify cart items
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/auth");
      return;
    }
    toast.success("Order placed successfully!");
    clearCart();
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, pizza) => total + pizza.quantity * pizza.ingredients.length * 2.5,
      0
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return; // Prevent quantity from being less than 1
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updateCart(updatedCart); // Update the cart in the context
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "url('/images/cart-background.jpg') center/cover no-repeat",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={1} style={{ color: "#fa541c" }}>
          Your Cart
        </Title>
        <Text style={{ fontSize: "1.2rem", color: "#555" }}>
          Review your order before checkout!
        </Text>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Text style={{ fontSize: "1.5rem", color: "#555" }}>
            Your cart is empty. Start customizing your pizza!
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            style={{
              marginTop: "1rem",
              backgroundColor: "#fa541c",
              borderColor: "#fa541c",
            }}
          >
            Go Back to Home
          </Button>
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={16}>
            {cart.map((pizza, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: "1rem",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Row align="middle">
                  <Col span={12}>
                    <Title level={4}>Pizza {index + 1}</Title>
                    <Text>Ingredients: {pizza.ingredients.join(", ")}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "center" }}>
                    <InputNumber
                      min={1}
                      value={pizza.quantity}
                      onChange={(value) => handleQuantityChange(index, value || 1)}
                      style={{ width: "60px" }}
                    />
                    <Text style={{ marginLeft: "8px" }}>Qty</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "right" }}>
                    <Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      ${(pizza.quantity * pizza.ingredients.length * 2.5).toFixed(2)}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={4}>Order Summary</Title>
              <Divider />
              <Row justify="space-between">
                <Text>Total Pizzas:</Text>
                <Text>{cart.reduce((total, pizza) => total + pizza.quantity, 0)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Total Price:</Text>
                <Text style={{ fontWeight: "bold" }}>${calculateTotal().toFixed(2)}</Text>
              </Row>
              <Divider />
              <Button
                type="primary"
                size="large"
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  backgroundColor: "#fa541c",
                  borderColor: "#fa541c",
                }}
              >
                Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage;