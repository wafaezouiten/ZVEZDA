import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../Product/ProductCard";
import allProducts from "../data/AllProducts"; 

  const NewArrivals = ({
    refProp, // 👈 receive the ref
    imageIndices,
    setImageIndices,
    selectedOptions,
    setSelectedOptions
  }) => {
  
  // Handle previous image navigation
  const handlePrev = (productId, images) => {
    setImageIndices((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  // Handle next image navigation
  const handleNext = (productId, images) => {
    setImageIndices((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div ref={refProp} className="py-5">
      <Container>
        <h2 className="text-center fw-bold">New Arrivals</h2>
        <Row className="justify-content-center mt-4">
          {/* Use shared product array */}
          {Array.isArray(allProducts) && allProducts.length > 0 ? (
            allProducts.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <ProductCard
                  product={product}
                  imageIndex={imageIndices[product.id] || 0}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  selected={selectedOptions[product.id]}
                  setSelectedOptions={setSelectedOptions}
                />
              </Col>
            ))
          ) : (
            <p>No new arrivals at the moment.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default NewArrivals;
