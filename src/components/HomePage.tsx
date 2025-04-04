import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button, Card, Typography, Row, Col, Space, Spin } from "antd";
import toast from "react-hot-toast";
import axios from "axios";

const { Title, Text } = Typography;

const HomePage = () => {
  const { addToCart } = useCart();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    // Fetch ingredients from the API
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/ingredients");
        const parsedIngredients = response.data.map((ingredient: any) => ({
          ...ingredient,
          price: typeof ingredient.price === "string"
            ? parseFloat(ingredient.price.replace("$", ""))
            : ingredient.price,
        }));
        setIngredients(parsedIngredients);
      } catch (error) {
        toast.error("Failed to load ingredients. Please try again later.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const toggleIngredient = (ingredient: { name: string; price: number }) => {
    setSelectedIngredients((prev) => {
      const exists = prev.find((item) => item.name === ingredient.name);
      if (exists) {
        return prev.filter((item) => item.name !== ingredient.name);
      } else {
        return [...prev, { name: ingredient.name, price: ingredient.price.toFixed(2) }];
      }
    });
  };
  
  const addPizzaToCart = () => {
    console.log("Selected ingredients:", selectedIngredients); // Debug log
  
    if (selectedIngredients.length === 0) {
      toast.error("Please select at least one ingredient!");
      return;
    }
    addToCart({
      id: Date.now(),
      ingredients: selectedIngredients,
      quantity: 1,
    });
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
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

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {ingredients.map((ingredient) => (
            <Col xs={24} sm={12} md={8} lg={6} key={ingredient.id}>
              <Card
                hoverable
                onClick={() => toggleIngredient(ingredient)}
                style={{
                  border: selectedIngredients.some((item) => item.name === ingredient.name)
                    ? "2px solid #fa541c"
                    : "1px solid #f0f0f0",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <Space direction="vertical" size="small" align="center">
                  <img
                    src={ingredient.name.toLowerCase() + ".jpg"} // Fallback image
                    alt={ingredient.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <Title level={4}>{ingredient.name}</Title>
                  <Text style={{ color: "#555" }}>${ingredient.price.toFixed(2)}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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