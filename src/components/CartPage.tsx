import { useCart } from "../context/CartContext";
import { Button, Card, Typography, Row, Col, Divider, InputNumber, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;

const CartPage = () => {
  const { cart, updateCart, clearCart } = useCart();
  const navigate = useNavigate();
  const hasFetchedCart = useRef(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (hasFetchedCart.current) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("You need to log in to view your cart.");
          navigate("/login");
          return;
        }

        const decodedToken: { id: string; email: string } = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:3000/cart?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch cart items");

        const data = await response.json();

        const formattedCart = data.map((item: any) => ({
          id: item.id,
          quantity: 1,
          ingredients: Object.keys(item.pizzaDetails),
        }));

        updateCart(formattedCart);
        hasFetchedCart.current = true;
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items.");
      }
    };

    fetchCartItems();
  }, [updateCart, navigate]);

  const calculateTotal = () =>
    cart.reduce(
      (total, pizza) => total + pizza.quantity * pizza.ingredients.length * 2.5,
      0
    );

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updateCart(updatedCart);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please login to place an order.");
      navigate("/auth");
      return;
    }

    try {
      const decodedToken: { id: string; email: string } = jwtDecode(token);
      const userId = decodedToken.id;

      const orderDetails = {
        pizzas: cart.map((pizza) => ({
          ingredients: pizza.ingredients.map((ingredient) => ({
            name: ingredient,
            price: "2.50",
          })),
          quantity: pizza.quantity,
        })),
        totalPrice: calculateTotal().toFixed(2),
        orderDate: new Date().toISOString().split("T")[0],
      };

      const payload = { userId, orderDetails };

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place the order. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff 40%, #fff7f0 100%)",
        padding: "3rem 1rem",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={1} style={{ color: "#fa541c", fontWeight: "bold" }}>
          Your Cart
        </Title>
        <Text style={{ fontSize: "1.2rem", color: "#666" }}>
          Review your custom pizzas before placing the order.
        </Text>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <Empty
            description={<Text style={{ fontSize: "1.2rem" }}>Your cart is empty</Text>}
          />
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            style={{
              marginTop: "1.5rem",
              backgroundColor: "#fa541c",
              borderColor: "#fa541c",
            }}
          >
            Browse Pizzas
          </Button>
        </div>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={16}>
            {cart.map((pizza, index) => (
              <Card
                key={index}
                hoverable
                style={{
                  marginBottom: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #f0f0f0",
                  background: "#fff",
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col span={12}>
                    <Title level={4} style={{ color: "#fa8c16" }}>
                      Pizza {index + 1}
                    </Title>
                    <Text type="secondary">
                      Ingredients: {pizza.ingredients.join(", ")}
                    </Text>
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
                    <Text strong style={{ fontSize: "1.1rem", color: "#389e0d" }}>
                      ${(pizza.quantity * pizza.ingredients.length * 2.5).toFixed(2)}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                background: "#fff",
              }}
            >
              <Title level={4}>Order Summary</Title>
              <Divider />
              <Row justify="space-between" style={{ marginBottom: "0.5rem" }}>
                <Text>Total Pizzas:</Text>
                <Text>{cart.reduce((acc, item) => acc + item.quantity, 0)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: "1rem" }}>
                <Text>Total Price:</Text>
                <Text style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  ${calculateTotal().toFixed(2)}
                </Text>
              </Row>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                style={{
                  backgroundColor: "#fa541c",
                  borderColor: "#fa541c",
                  borderRadius: "8px",
                }}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage;
