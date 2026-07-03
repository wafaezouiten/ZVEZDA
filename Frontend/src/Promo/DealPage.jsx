import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../Product/ProductCard";

const allDeals = [
  {
    id: 1,
    name: "Classic Hoodie",
    category: "dresses",
    image: ['image1.jpg', 'image2.jpg'],
    price: 159.99,
    discount: 10,
    dealEndTime: "2025-05-24T00:01:10Z",
    variants: {
      Black: { S: 3, M: 2, L: 1, XL: 0 },
      Grey: { S: 1, M: 1, L: 5, XL: 2 },
      Red: { S: 2, M: 9, L: 0, XL: 1 },
    },
    description: "Cozy hoodie with comfortable fit.",
  },
  {
    id: 2,
    name: "Denim Jacket",
    category: "jackets",
    image: ['image1.jpg', 'image2.jpg'],
    price: 179.99,
    discount: 15,
    dealEndTime: "2025-05-26T23:59:00Z",
    variants: {
      Black: { S: 1, M: 0, L: 7, XL: 1 },
      Grey: { S: 0, M: 1, L: 0, XL: 0 },
      Red: { S: 2, M: 1, L: 3, XL: 0 },
    },
    description: "Stylish denim jacket for all seasons.",
  },
  {
    id: 3,
    name: "Denim Jacket (Slim Fit)",
    category: "jackets",
    image: ['image1.jpg', 'image2.jpg'],
    price: 189.99,
    discount: 20,
    dealEndTime: "2025-05-26T23:59:00Z",
    variants: {
      Black: { S: 1, M: 0, L: 2, XL: 1 },
      Grey: { S: 0, M: 1, L: 0, XL: 0 },
      Red: { S: 2, M: 1, L: 8, XL: 0 },
    },
    description: "Slim fit denim jacket with modern look.",
  },
];

const DealPage = () => {
  const location = useLocation();
  const [category, setCategory] = useState("");
  const [imageIndices, setImageIndices] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setCategory(categoryParam || "");
  }, [location]);

  // Countdown timer update every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      const newTimeLeft = {};
      allDeals.forEach((deal) => {
        if (deal.dealExpiresAt) {
          const dealEnd = new Date(deal.dealExpiresAt).getTime();
          const diff = dealEnd - now;

          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            newTimeLeft[deal.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[deal.id] = "Deal expired";
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredDeals = category
    ? allDeals.filter((deal) => deal.category === category)
    : allDeals;

  const handlePrev = (productId, images) => {
    setImageIndices((prev) => {
      const current = prev[productId] ?? 0;
      const newIndex = current === 0 ? images.length - 1 : current - 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const handleNext = (productId, images) => {
    setImageIndices((prev) => {
      const current = prev[productId] ?? 0;
      const newIndex = current === images.length - 1 ? 0 : current + 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div className="py-5">
      <Container>
        <h1 className="text-center fw-bold mb-4">All Deals</h1>
        {category && <h2 className="text-center mb-4">Category: {category}</h2>}

        <Row>
          {filteredDeals.length > 0 &&
            filteredDeals.map((deal) => {
              const discountedPrice = deal.discount
                ? +(deal.price * (1 - deal.discount / 100)).toFixed(2)
                : deal.price;

              const product = {
                ...deal,
                price: discountedPrice,
                oldPrice: deal.discount ? deal.price : null,
              };

              return (
                <Col key={deal.id} md={6} lg={4} className="mb-4">
                  <ProductCard
                    product={product}
                    imageIndex={imageIndices[deal.id] || 0}
                    setImageIndices={setImageIndices}
                    selected={selectedOptions[deal.id]}
                    setSelectedOptions={setSelectedOptions}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    timeLeft={timeLeft[deal.id]}
                  />
                </Col>
              );
            })}

        </Row>
      </Container>
    </div>
  );
};

export default DealPage;
