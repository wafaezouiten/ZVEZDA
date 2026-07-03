import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SupportCenter = () => {
  return (
    <Container >
      <h2 className="text-center mb-4 display-4 text-primary">Support Center</h2>
      <p className="text-center lead mb-5">
        Welcome to the ZVEZDA Support Center. Here you'll find answers to common questions and ways to contact us if you need further assistance.
      </p>

      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Contact Support</Card.Title>
              <Card.Text>Need help with something specific? Reach out to us directly.</Card.Text>
              <Link to="/contact">
                <Button variant="dark">Go to Contact Page</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>FAQs</Card.Title>
              <Card.Text>Browse through frequently asked questions for quick solutions.</Card.Text>
              <Link to="/faqs">
                <Button variant="dark">View FAQs</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Shipping & Returns</Card.Title>
              <Card.Text>Learn about delivery, return policy, and refunds.</Card.Text>
              {/* Link to a future "Shipping & Returns" page if you build one */}
              <Button variant="dark" disabled>Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Orders & Payments</Card.Title>
              <Card.Text>Get help with orders, payments, and invoices.</Card.Text>
              <Button variant="dark" disabled>Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Product Info</Card.Title>
              <Card.Text>Find size guides, fabric care info, and more.</Card.Text>
              <Button variant="dark" disabled>Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Track Your Order</Card.Title>
              <Card.Text>Use your tracking code to follow your delivery.</Card.Text>
              <Button variant="dark" disabled>Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SupportCenter;
