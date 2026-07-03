import React from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import DealCountdown from "../Promo/DealCountdown";
import { useNavigate } from "react-router-dom";

const DealsOfTheMonth = ({ targetDate }) => {
  const navigate = useNavigate();
  return (
    <div className="py-5 bg-light rounded my-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="text-center text-lg-start">
            <h2 className="display-5 fw-bold">Deals Of The Month</h2>
            <div className="mb-4 border-bottom border-dark w-25 mx-auto mx-lg-0"></div>
            <p className="text-muted">
              Explore our exclusive monthly deals featuring premium collections at unbeatable prices.
            </p>
            <Button variant="primary" className="mt-3" onClick={() => navigate("/deals")}>
              Buy Now
            </Button>
            <p className="mt-4 fw-medium">Hurry, Before It's Too Late!</p>
            <DealCountdown targetDate={targetDate} />
          </Col>

          <Col lg={6} className="text-center" style={{ marginTop: '100px' }}>
            <Carousel fade>
              {["imageDeal1.jpg", "imageDeal2.jpg", "imageDeal3.jpg"].map((image, index) => (
                <Carousel.Item key={index}>
                  <div className="position-relative overflow-hidden rounded shadow">
                    <img
                      src={image}
                      alt={`Deal of the Month ${index + 1}`}
                      className="img-fluid"
                      style={{ height: "500px", objectFit: "cover", width: "100%" }}
                    />
                    <div className="position-absolute bottom-0 start-0 p-3 bg-white rounded shadow-sm">
                      <div className="d-flex align-items-center text-muted">
                        <div
                          className={`rounded-circle bg-${index === 0 ? "primary" : index === 1 ? "danger" : "success"}`}
                          style={{ width: "10px", height: "10px", marginRight: "8px" }}
                        ></div>
                        <span className="fw-bold">
                          {index === 0 ? "Spring Collection" : index === 1 ? "Exclusive Offers" : "Limited Edition"}
                        </span>
                      </div>
                      <div className="fw-semibold mt-1">{(30 + index * 10) + "% OFF"}</div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DealsOfTheMonth;
