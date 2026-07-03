import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Row className="align-items-center text-center" style={{ marginLeft: '100px' }}>
      <Col md={3} className="d-flex justify-content-center">
        <img
          src="image1.jpg"
          alt="Outfit 1"
          className="img-fluid rounded shadow"
          style={{ height: "100%", objectFit: "cover", marginLeft: "55px" }}
        />
      </Col>

      <Col md={5} className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="fw-bold display-4">ULTIMATE SALE</h1>
        <p className="fs-4 text-muted">NEW COLLECTION</p>
        <Button variant="dark" size="lg" className="mt-3 px-5 py-3" onClick={()=> navigate('/products')}>
          SHOP NOW
        </Button>
      </Col>

      <Col md={3} className="d-flex justify-content-center">
        <img
          src="image3.jpg"
          alt="Outfit 3"
          className="img-fluid rounded shadow"
          style={{ height: "100%", objectFit: "cover", marginLeft: "15px", marginRight: "15px" }}
        />
      </Col>
    </Row>
  );
};

export default HeroSection;
