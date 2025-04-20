import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button, Card, Typography, Space, Spin, Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";

const { Title, Text } = Typography;

const HomePage = () => {
  const { addToCart } = useCart();
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null); // reference for controlling carousel

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/ingredients");
        const parsedIngredients = response.data.map((ingredient: any) => ({
          ...ingredient,
          price:
            typeof ingredient.price === "string"
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
        minHeight: "100vh",
        background: "url('/images/pizza-background.jpg') center/cover no-repeat",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Dark Overlay */}
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

      {/* Header */}
      <div style={{ textAlign: "center", color: "#fff", marginBottom: "2rem" }}>
        <Title level={1} style={{ color: "#fa541c", fontSize: "3rem" }}>
          Customize Your Pizza
        </Title>
        <Text style={{ fontSize: "1.2rem", color: "#fff" }}>
          Swipe or click to choose your favorite ingredients!
        </Text>
      </div>

      {/* Ingredient Slider */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
            {/* Left Arrow */}
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => carouselRef.current?.prev()}
              style={{
                position: "absolute",
                top: "40%",
                left: "-40px",
                transform: "translateY(-50%)",
                zIndex: 1,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            />

            {/* Right Arrow */}
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => carouselRef.current?.next()}
              style={{
                position: "absolute",
                top: "40%",
                right: "-40px",
                transform: "translateY(-50%)",
                zIndex: 1,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            />

            {/* Carousel */}
            <Carousel
              dots={false}
              ref={carouselRef}
              slidesToShow={3}
              autoplay={false}
              infinite
              responsive={[
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
            >
              {ingredients.map((ingredient) => (
                <div key={ingredient.id}>
                  <Card
                    hoverable
                    onClick={() => toggleIngredient(ingredient)}
                    style={{
                      width: 250,
                      margin: "0 auto",
                      border: selectedIngredients.some((item) => item.name === ingredient.name)
                        ? "2px solid #fa541c"
                        : "1px solid #f0f0f0",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      background: "#fff",
                    }}
                  >
                    <Space direction="vertical" size="small" align="center">
                      <img
                        src={ingredient.name.toLowerCase() + ".jpg"}
                        alt={ingredient.name}
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                      />
                      <Title level={4}>{ingredient.name}</Title>
                      <Text style={{ color: "#333" }}>${ingredient.price.toFixed(2)}</Text>
                    </Space>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </>
      )}

      {/* Add to Cart Button */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Button
          type="primary"
          size="large"
          onClick={addPizzaToCart}
          style={{
            backgroundColor: "#fa541c",
            borderColor: "#fa541c",
            borderRadius: "6px",
            padding: "0 2rem",
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
