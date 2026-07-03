import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-center py-3"
      style={{
        backgroundColor: "rgb(248, 246, 246)",
        width: "100%",
        paddingBottom: "20px",
        marginTop: "auto", // Important for sticky footer flex layout
      }}
    >
      <Container>
        <Row className="d-flex justify-content-between align-items-center">
          {/* Left section (ZVEZDA) */}
          <Col
            xs={12}
            md={6}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <a
              href="/"
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                fontFamily: "Playfair Display, serif",
                color: "rgb(95, 93, 93)",
                textDecoration: "none",
                marginLeft: "0px",
              }}
            >
              ZVEZDA
            </a>
          </Col>

          {/* Right section (Links) */}
          <Col
            xs={12}
            md={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
              }}
            >
              <li style={{ marginRight: "20px" }}>
                <Link
                  to="/support"
                  style={{ textDecoration: "none", color: "rgb(95, 93, 93)" }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgb(95, 93, 93)",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Support Center
                  </button>
                </Link>
              </li>
              <li style={{ marginRight: "20px" }}>
                <Link
                  to="/contact"
                  style={{ textDecoration: "none", color: "rgb(95, 93, 93)" }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgb(95, 93, 93)",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Contact
                  </button>
                </Link>
              </li>
              <li style={{ marginRight: "20px" }}>
                <Link
                  to="/faqs"
                  style={{ textDecoration: "none", color: "rgb(95, 93, 93)" }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgb(95, 93, 93)",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    FAQs
                  </button>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Bottom copyright text */}
        <p>© 2025 ZVEZDA. All Rights Reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
