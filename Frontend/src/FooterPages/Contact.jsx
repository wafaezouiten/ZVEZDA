import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Contact = () => {
  return (
    <Container>
      <div className="text-center mb-5">
        <h2 className="display-4 text-primary mb-3">Contact Us</h2>
        <p className="lead text-muted">
          Have questions or need assistance? We're here to help you!
        </p>
      </div>

      <Row className="g-4 justify-content-center">
        <Col lg={5} className="pe-lg-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h3 className="mb-4 pb-2 border-bottom border-primary d-inline-block">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                Contact Details
              </h3>
              
              <ul className="list-unstyled contact-info">
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-envelope-fill fs-4 text-primary me-3 mt-1"></i>
                  <div>
                    <h5 className="mb-1">Email</h5>
                    <a href="mailto:contact@zvezda.com" className="text-decoration-none">
                      contact@zvezda.com
                    </a>
                  </div>
                </li>
                
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-telephone-fill fs-4 text-primary me-3 mt-1"></i>
                  <div>
                    <h5 className="mb-1">Phone</h5>
                    <a href="tel:+1234567890" className="text-decoration-none">
                      +1 234 567 890
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-4 pt-3">
                <h5 className="mb-3">Business Hours</h5>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="d-flex justify-content-between py-2">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <h3 className="mb-4 pb-2 border-bottom border-primary d-inline-block">
                <i className="bi bi-chat-left-text-fill me-2 text-primary"></i>
                Get In Touch
              </h3>
              
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="name" className="mb-3">
                      <Form.Label className="fw-bold">Full Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your name" 
                        required 
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label className="fw-bold">Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="subject" className="mb-3">
                  <Form.Label className="fw-bold">Subject</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="What's this about?" 
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group controlId="message" className="mb-4">
                  <Form.Label className="fw-bold">Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    placeholder="Your message here..." 
                    required 
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit"
                    className="fw-bold py-2"
                  >
                    <i className="bi bi-send-fill me-2"></i>
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;