import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useCart } from "./context/CartContext";
import { ingredients } from "../data/ingredients";
import { Button, Card, Typography, Row, Col, Space } from "antd";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const HomePage = () => {
  const { addToCart } = useCart();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addPizzaToCart = () => {
    if (selectedIngredients.length === 0) {
      toast.error("Please select at least one ingredient!");
      return;
    }
    addToCart({ id: Date.now(), ingredients: selectedIngredients, quantity: 1 });
    toast.success("Pizza added to cart!");
    setSelectedIngredients([]); 
    navigate("/cart");
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "url('/images/pizza-background.jpg') center/cover no-repeat",
        padding: "2rem",
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
          zIndex: -1,
        }}
      ></div>

      <div style={{ textAlign: "center", color: "#fff", marginBottom: "2rem" }}>
        <Title level={1} style={{ color: "#fa541c" }}>
          Customize Your Pizza
        </Title>
        <Text style={{ fontSize: "1.2rem" }}>
          Select your favorite ingredients to create your perfect pizza!
        </Text>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {ingredients.map((ingredient) => (
          <Col xs={24} sm={12} md={8} lg={6} key={ingredient.name}>
            <Card
              hoverable
              onClick={() => toggleIngredient(ingredient.name)}
              style={{
                border:
                  selectedIngredients.includes(ingredient.name)
                    ? "2px solid #fa541c"
                    : "1px solid #f0f0f0",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <Space direction="vertical" size="small" align="center">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <Title level={4}>{ingredient.name}</Title>
                <Text style={{ color: "#555" }}>
                  ${ingredient.price ? ingredient.price.toFixed(2) : "0.00"}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          type="primary"
          size="large"
          onClick={addPizzaToCart}
          style={{
            backgroundColor: "#fa541c",
            borderColor: "#fa541c",
            borderRadius: "5px",
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default HomePage;