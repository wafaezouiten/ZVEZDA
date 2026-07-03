import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const AdminOrderDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Spinner animation="border" />;

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
        <div>
          <Button variant="secondary" onClick={() => navigate("/admin/orders")} className="mt-3">
            Back to Orders
          </Button>
        </div>
      </Alert>
    );

  if (!order)
    return (
      <Card className="p-4 text-center m-4">
        <h4>Order not found</h4>
        <Button variant="secondary" onClick={() => navigate("/admin/orders")} className="mt-3">
          Back to Orders
        </Button>
      </Card>
    );

  return (
    <div className="p-4">
      <h2 className="mb-4">Order Details - {order.shippingAddress.fullName}</h2>

      {/* Customer Info */}
      <Card className="mb-4">
        <Card.Header>
          <strong>Customer Info</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Name:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Email:</strong> {order.user?.email || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Phone:</strong> {order.shippingAddress.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Items */}
      <Card className="mb-4">
        <Card.Header>
          <strong>Items</strong>
        </Card.Header>
        <Card.Body>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Color</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price (MAD)</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toFixed(2)} MAD</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Totals */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <strong>Shipping</strong>
            </Card.Header>
            <Card.Body>
              <p>{order.freeShippingThreshold?.toFixed(2) || "0.00"} MAD</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <strong>Total</strong>
            </Card.Header>
            <Card.Body>
              <h5 className="fw-bold">{order.totalPrice?.toFixed(2) || "0.00"} MAD</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="secondary" onClick={() => navigate("/admin/orders")}>
        Back to Orders
      </Button>
    </div>
  );
};

export default AdminOrderDetails;
