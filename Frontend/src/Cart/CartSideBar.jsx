import React from "react";
import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CartSideBar = ({ item, onUpdateQuantity, onClose, stockValue }) => {
    const navigate = useNavigate();
    const subtotal = item ? item.price * item.quantity : 0;

    if (!item) return null;

    const handleQuantityChange = (newQuantity) => {
        const clampedQty = Math.max(1, Math.min(newQuantity, stockValue));
        onUpdateQuantity(clampedQty);
    };

    return (
        <div className="cart-sidebar">
            {/* Header */}
            <div className="cart-header">
                <h5>Your Cart</h5>
                <button onClick={onClose} className="close-btn">×</button>
            </div>

            {/* Body */}
            <div className="cart-body">
                <div className="product-display">
                    <div className="product-image">
                        <img
                            src={`/${item.image}`}
                            alt={item.name}
                        />
                    </div>
                    
                    <div className="product-info">
                        <h6>{item.name}</h6>
                        
                        <div className="product-attributes">
                            <Badge bg="light" text="dark">
                                Color: {item.color}
                            </Badge>
                            <Badge bg="light" text="dark">
                                Size: {item.size}
                            </Badge>
                        </div>
                        
                        <div className="price-quantity">
                            <span className="price">{item.price.toFixed(2)} MAD</span>
                            <div className="quantity-control">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </Button>
                                <span className="quantity">{item.quantity}</span>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={item.quantity >= stockValue}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="cart-footer">
                <div className="order-summary">
                    <div className="total">
                        <span>Total:</span>
                        <span>{subtotal.toFixed(2)} MAD</span>
                    </div>
                </div>
                <Button
                    variant="dark"
                    className="view-cart-btn"
                    onClick={() => {
                        onClose();
                        navigate("/cart");
                    }}
                >
                    View Cart
                </Button>
            </div>

            <style jsx>{`
                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 380px;
                    height: 100vh;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    z-index: 1050;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-header {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #333;
                }
                
                .cart-body {
                    padding: 1rem;
                    flex: 1;
                    overflow-y: auto;
                }
                
                .product-display {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                
                .product-image {
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                }
                
                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 4px;
                }
                
                .product-info {
                    flex-grow: 1;
                }
                
                .product-info h6 {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                
                .product-attributes {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }
                
                .price-quantity {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .price {
                    font-weight: bold;
                }
                
                .quantity-control {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .quantity {
                    min-width: 20px;
                    text-align: center;
                }
                
                .cart-footer {
                    padding: 1rem;
                    border-top: 1px solid #eee;
                }
                
                .order-summary {
                    padding: 1rem 0;
                }
                
                .total {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                
                .view-cart-btn {
                    width: 100%;
                    padding: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default CartSideBar;