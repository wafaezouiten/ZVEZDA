import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import allProducts from "../data/AllProducts";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return parsed.map(item => ({
          ...item,
          quantity: Math.max(1, Number(item.quantity) || 1),
          price: Number(item.price) || 0
        }));
      }
      return [];
    } catch (error) {
      console.error("Error parsing cart data:", error);
      return [];
    }
  });

  const [stockInfo, setStockInfo] = useState({});
  const [hasStockIssues, setHasStockIssues] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(800);
  const [loadingThreshold, setLoadingThreshold] = useState(true);

  // Récupérer token depuis localStorage
  const token = localStorage.getItem("authToken");

  // Axios instance avec header Authorization si token existe
  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Intercepteur pour gérer erreur 401
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  // Charger seuil livraison gratuite avec token dans header
  useEffect(() => {
    if (!token) {
      // Pas de token, on met le seuil par défaut et stoppe le loading
      setFreeShippingThreshold(800);
      setLoadingThreshold(false);
      return;
    }

    api.get("config/free-shipping")
      .then(res => {
        setFreeShippingThreshold(Number(res.data.threshold) || 800);
      })
      .catch(err => {
        console.error("Failed to fetch free shipping threshold:", err);
      })
      .finally(() => {
        setLoadingThreshold(false);
      });
  }, [token]);

  // Vérification stock selon cartItems et allProducts
  useEffect(() => {
    const newStockInfo = {};
    let stockProblems = false;

    cartItems.forEach(item => {
      const product = allProducts.find(p => p.id === item.id);
      const stock = product?.variants?.[item.color]?.[item.size] || 0;

      newStockInfo[`${item.id}-${item.color}-${item.size}`] = {
        maxStock: stock,
        isOutOfStock: stock === 0,
        isOverLimit: item.quantity > stock,
      };

      if (item.quantity > stock) {
        stockProblems = true;
      }
    });

    setStockInfo(newStockInfo);
    setHasStockIssues(stockProblems);
  }, [cartItems]);

  const updateQuantity = (id, color, size, newQuantity) => {
    const quantity = Math.max(1, Math.floor(Number(newQuantity)) || 1);
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeItem = (id, color, size) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(
        item => !(item.id === id && item.color === color && item.size === size)
      );
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const qualifiesForFreeShipping = subtotal > freeShippingThreshold;
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <Container className="my-3">
      <h2 className="mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", fontSize: "2.5rem" }}>
        Shopping Cart
      </h2>

      {hasStockIssues && (
        <Alert variant="danger" className="mb-4">
          Some items exceed available stock. Please adjust quantities before checkout.
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your cart is empty</h4>
          <Link to="/" className="btn btn-dark mt-3">Continue Shopping</Link>
        </div>
      ) : (
        <Row>
          <Col md={8}>
            <div className="border-bottom pb-3 mb-3">
              <Row className="fw-bold text-uppercase small">
                <Col md={5}>Product</Col>
                <Col>Price</Col>
                <Col>Quantity</Col>
                <Col>Total</Col>
                <Col></Col>
              </Row>
            </div>

            {cartItems.map((item) => {
              const itemKey = `${item.id}-${item.color}-${item.size}`;
              const stockData = stockInfo[itemKey] || {};
              const { isOutOfStock, isOverLimit, maxStock } = stockData;

              return (
                <div key={itemKey} className="border-bottom py-3">
                  {isOutOfStock && (
                    <Alert variant="danger" className="py-1 mb-2">
                      This item is out of stock
                    </Alert>
                  )}
                  {isOverLimit && !isOutOfStock && (
                    <Alert variant="warning" className="py-1 mb-2">
                      Only {maxStock} available in stock
                    </Alert>
                  )}

                  <Row className="align-items-center">
                    <Col md={5}>
                      <div className="d-flex align-items-center">
                        <Image
                          src={`/${item.image}`}
                          alt={item.name}
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px", opacity: isOutOfStock ? 0.5 : 1 }}
                          className="me-3"
                        />
                        <div style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted small mb-0">Color: {item.color}</p>
                          <p className="text-muted small mb-0">Size: {item.size}</p>
                          {!isOutOfStock && (
                            <p className="text-muted small mb-0">
                              In Stock: {maxStock}
                            </p>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <p className="mb-0">{item.price.toFixed(2)} MAD</p>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <div style={{ width: "30px", margin: "0 5px", textAlign: "center" }}>
                          {item.quantity}
                        </div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <p className="mb-0">{(item.price * item.quantity).toFixed(2)} MAD</p>
                    </Col>
                    <Col>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => removeItem(item.id, item.color, item.size)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Col>

          <Col md={4}>
            <div className="bg-light p-4" style={{ borderRadius: "5px" }}>
              <h5 className="mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} MAD</span>
              </div>

              <div className="mb-3">
                {loadingThreshold ? (
                  <Alert variant="info" className="py-2 mb-0">Loading shipping info...</Alert>
                ) : qualifiesForFreeShipping ? (
                  <Alert variant="success" className="py-2 mb-0">
                    You qualify for free shipping!
                  </Alert>
                ) : (
                  <Alert variant="info" className="py-2 mb-0">
                    Add {amountNeededForFreeShipping.toFixed(2)} MAD to get free shipping
                  </Alert>
                )}
              </div>

              <Button
                variant="dark"
                className="w-100"
                disabled={hasStockIssues || cartItems.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;
