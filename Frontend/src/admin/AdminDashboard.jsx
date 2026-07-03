import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import { PersonFill, ClockFill, CheckLg, ArrowCounterclockwise } from "react-bootstrap-icons";

const AdminDashboard = () => {
  const stats = {
    orders: {
      today: 2,
      week: 25,
      month: 32,
    },
  };

  const orderStatusCounts = {
    processing: 12,
    delivered: 8,
    returned: 3,
  };

  const getStatusBadgeWithIcon = (status) => {
    switch (status) {
      case "processing":
        return (
          <>
            <ClockFill className="me-2 text-warning" />
            <Badge bg="warning" text="dark">
              Processing
            </Badge>
          </>
        );
      case "delivered":
        return (
          <>
            <CheckLg className="me-2 text-success" />
            <Badge bg="success">Delivered</Badge>
          </>
        );
      default:
        return (
          <>
            <ArrowCounterclockwise className="me-2 text-danger" />
            <Badge bg="danger">Returned</Badge>
          </>
        );
    }
  };

  return (
    <Container fluid>
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <PersonFill size={32} className="me-3 text-primary" />
                <div>
                  <h4 className="mb-0">Hello!</h4>
                  <p className="text-muted mb-0">Welcome back to your dashboard</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Orders</h4>
        </Col>
      </Row>
      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase text-muted mb-0">Today</h6>
              </div>
              <h2 className="mb-2" style={{ color: "blue" }}>
                {stats.orders.today}
              </h2>
              <p className="text-muted mb-0">{stats.orders.today} orders today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase text-muted mb-0">This Week</h6>
              </div>
              <h2 className="mb-2" style={{ color: "blue" }}>
                {stats.orders.week}
              </h2>
              <p className="text-muted mb-0">{stats.orders.week} orders this week</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase text-muted mb-0">This Month</h6>
              </div>
              <h2 className="mb-2" style={{ color: "blue" }}>
                {stats.orders.month}
              </h2>
              <p className="text-muted mb-0">{stats.orders.month} orders this month</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Product Status Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Order Status</h4>
        </Col>
      </Row>
      <Row className="g-4">
        {Object.entries(orderStatusCounts).map(([status, count]) => (
          <Col md={4} key={status}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-uppercase text-muted mb-0">{status}</h6>
                  <div className="d-flex align-items-center">
                    {getStatusBadgeWithIcon(status)}
                  </div>
                </div>
                <h2 className="mb-2" style={{ color: "blue" }}>
                  {count}
                </h2>
                <p className="text-muted mb-0">
                  {count} orders {status}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
