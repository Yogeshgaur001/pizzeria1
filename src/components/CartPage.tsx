import { useCart } from "../context/CartContext";
import { Button, Card, Typography, Row, Col, Divider, InputNumber } from "antd";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
        // Prevent fetching the cart multiple times
        if (hasFetchedCart.current) return;
  
        // Retrieve the authToken from localStorage
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
        console.log("User ID from token:", userId); // Debug log
  
        // Fetch cart items using the user ID
        const response = await fetch(`http://localhost:3000/cart?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
  
        const data = await response.json();
        console.log("Cart items fetched:", data); // Debug log
  
        // Map the API response to the expected cart structure
        const formattedCart = data.map((item: any) => ({
          id: item.id,
          quantity: 1, // Default quantity to 1 (can be updated later)
          ingredients: Object.keys(item.pizzaDetails), // Extract ingredient names
        }));
  
        console.log("Formatted cart:", formattedCart); // Debug log
        updateCart(formattedCart); // Update the cart context with the formatted data
  
        hasFetchedCart.current = true; // Mark as fetched
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items.");
      }
    };
  
    fetchCartItems();
  }, [updateCart, navigate]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please login to place an order.");
      navigate("/auth");
      return;
    }
  
    try {
      // Decode the token to extract the user ID
      const decodedToken: { id: string; email: string } = jwtDecode(token);
      const userId = decodedToken.id;
  
      // Prepare the order payload
      const orderDetails = {
        pizzas: cart.map((pizza) => ({
          ingredients: pizza.ingredients.map((ingredient) => ({
            name: ingredient,
            price: "2.50", // Assuming a fixed price for simplicity
          })),
          quantity: pizza.quantity,
        })),
        totalPrice: calculateTotal().toFixed(2),
        orderDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
      };
  
      const payload = {
        userId,
        orderDetails,
      };
  
      // Send the POST request to create the order
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
  
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders"); // Redirect to orders page after successful checkout
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place the order. Please try again.");
    }
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