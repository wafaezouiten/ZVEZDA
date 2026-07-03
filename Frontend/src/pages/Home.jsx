import React, { useState } from "react";
import { Container } from "react-bootstrap";
import HeroSection from "../Layout/HeroSection";
import DealsOfTheMonth from "../Promo/DealsOfTheMonth";
import NewArrivals from "./NewArrivals"; 
import allProducts from "../data/AllProducts";

const Home = ({ newArrivalsRef }) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);

  const [imageIndices, setImageIndices] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const newArrivals = allProducts.slice(0, 6);

  return (
    <Container fluid className="my-5">
      <HeroSection />
      <DealsOfTheMonth targetDate={targetDate} />
      
      <div ref={newArrivalsRef}>
        <NewArrivals
          newArrivals={newArrivals}
          imageIndices={imageIndices}
          setImageIndices={setImageIndices}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      </div>
    </Container>
  );
};

export default Home;
