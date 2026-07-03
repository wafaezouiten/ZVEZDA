import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// City shipping prices
const CITY_SHIPPING_PRICES = {
  Casablanca: 30,
  Rabat: 35,
  Marrakech: 40,
  Fes: 45,
  Tangier: 50,
  Agadir: 55,
  Meknes: 45,
  Oujda: 60,
  Kenitra: 40,
  Tetouan: 50,
  Safi: 50,
  Mohammedia: 35,
  "El Jadida": 45,
  "Beni Mellal": 55,
  Nador: 60,
  Other: 80,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Morocco",
    paymentMethod: "cashOnDelivery",
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(800); // Default fallback
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const token = localStorage.getItem("authToken");

  // Axios instance with auth header if token exists
  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Interceptor to handle 401 Unauthorized globally
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  // Fetch free shipping threshold config on mount
  useEffect(() => {
    const fetchFreeShippingConfig = async () => {
      try {
        setIsLoadingConfig(true);
        const response = await axios.get("http://localhost:5000/api/config/free-shipping");
        if (response.data) {
          if (typeof response.data.freeShippingThreshold === "number") {
            setFreeShippingThreshold(response.data.freeShippingThreshold);
          } else if (typeof response.data === "number") {
            setFreeShippingThreshold(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch free shipping configuration:", error);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchFreeShippingConfig();
  }, []);

  // Load cart items from localStorage or redirect if empty
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate shipping price based on city and subtotal
  useEffect(() => {
    if (formData.city && !isLoadingConfig) {
      const cityKey = Object.keys(CITY_SHIPPING_PRICES).find(
        (key) => key.toLowerCase() === formData.city.trim().toLowerCase()
      );

      const price =
        subtotal > freeShippingThreshold
          ? 0
          : cityKey
          ? CITY_SHIPPING_PRICES[cityKey]
          : CITY_SHIPPING_PRICES.Other;

      setShippingPrice(price);
    } else {
      setShippingPrice(0);
    }
  }, [formData.city, subtotal, freeShippingThreshold, isLoadingConfig]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city"];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^0[5-7][0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setOrderError("You must be logged in to place an order.");
      return;
    }

    setIsProcessing(true);
    setOrderError("");

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: {
            street: formData.address.trim(),
            city: formData.city.trim(),
            country: formData.country,
          },
        },
        items: cartItems,
        paymentMethod: formData.paymentMethod,
        shippingPrice,
        subtotal,
        total: subtotal + shippingPrice,
        orderDate: new Date().toISOString(),
      };

      // Use the api instance (with token)
      const response = await api.post("orders", orderData);

      setCreatedOrder(response.data);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    } catch (error) {
      console.error("Failed to create order:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
        setOrderError(errorMessage);
      } else if (error.request) {
        setOrderError("Network error. Please check your connection and try again.");
      } else {
        setOrderError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Render order confirmation page
  if (orderSuccess) {
    return (
      <Container className="my-5 text-center">
        <h2 className="mb-4">Order Confirmed!</h2>
        <p className="lead mb-4">Thank you for your purchase.</p>
        {createdOrder?.orderId && (
          <p className="mb-4">
            Order ID: <strong>{createdOrder.orderId}</strong>
          </p>
        )}
        <div className="d-flex justify-content-center gap-3">
          <Button variant="dark" onClick={() => navigate("/orders")} className="px-4">
            View Your Orders
          </Button>
          <Button variant="outline-dark" onClick={() => navigate("/")} className="px-4">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  // Render empty cart message
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container className="my-5 text-center">
        <div className="py-5">
          <h2 className="mb-4">Your cart is empty</h2>
          <Button variant="dark" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  // Render loading state while fetching config
  if (isLoadingConfig) {
    return (
      <Container className="my-5 text-center">
        <div className="py-5">
          <h2 className="mb-4">Loading...</h2>
        </div>
      </Container>
    );
  }

  // Main checkout form and order summary render
  return (
    <Container className="my-3">
      <h2
        className="mb-4 text-center"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", fontSize: "2.5rem" }}
      >
        Checkout
      </h2>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-4">Shipping Information</h4>

              {orderError && (
                <Alert variant="danger" className="mb-4">
                  <strong>Order Failed:</strong> {orderError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        placeholder="e.g., 0612345678"
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        isInvalid={!!errors.city}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="paymentMethod">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                        <option value="cashOnDelivery">Cash on Delivery</option>
                        <option value="card" disabled>
                          Card (Coming soon)
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="dark" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>

              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted small mb-1">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                    <p className="mb-0">{(item.price * item.quantity).toFixed(2)} MAD</p>
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} MAD</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {formData.city ? (
                    subtotal > freeShippingThreshold ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `${shippingPrice.toFixed(2)} MAD`
                    )
                  ) : (
                    "Select city"
                  )}
                </span>
              </div>
              {subtotal > freeShippingThreshold && formData.city && (
                <Alert variant="success" className="py-1 mb-2">
                  You've qualified for free shipping!
                </Alert>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>{(subtotal + shippingPrice).toFixed(2)} MAD</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
