import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import Stock from "../Common/Stock";
import Price from "../Common/Price";
import allProducts from "../data/AllProducts";
import CartSideBar from "../Cart/CartSideBar";

const ProductDetailPage = () => {
    const { id } = useParams();
    const product = allProducts.find((p) => p.id === parseInt(id));

    const [selected, setSelected] = useState({ color: null, size: null });
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(product?.image[0]);
    const [showCart, setShowCart] = useState(false);
    const [cartItem, setCartItem] = useState(null);
    const [rating, setRating] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null); // New state for error message

    // stockValue always a number (0 if color/size not selected)
    const stockValue =
        selected.color && selected.size
            ? product?.variants?.[selected.color]?.[selected.size] ?? 0
            : 0;

    // When color or size changes, adjust quantity if needed
    useEffect(() => {
        if (selected.color && selected.size) {
            const newStock = product?.variants?.[selected.color]?.[selected.size] ?? 0;
            setQuantity((prevQty) => Math.min(prevQty, newStock));
        } else {
            setQuantity(1);
        }
        // Clear error when selection changes
        setErrorMessage(null);
    }, [selected.color, selected.size, product]);

    // Initialize cartItem from product
    useEffect(() => {
        if (product) {
            setMainImage(product.image[0]);
            setCartItem({
                ...product,
                quantity: 1,
            });
            setSelected({ color: null, size: null }); // Reset selections on product change
            setQuantity(1);
            setShowCart(false);
            setRating(0);
            setErrorMessage(null);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="container my-5">
                <h3>Product not found.</h3>
            </div>
        );
    }

    const handleAddToCart = () => {
        console.log("Add to Cart clicked", { selected, quantity, stockValue });

        if (!selected.color || !selected.size) {
            setErrorMessage("Please select color and size before adding to cart.");
            return;
        }
        if (stockValue === 0) {
            setErrorMessage("Selected variant is out of stock.");
            return;
        }

        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: mainImage,
            color: selected.color,
            size: selected.size,
        };

        // Get current cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if same product/color/size already exists in cart
        const existingItemIndex = existingCart.findIndex(
            (item) =>
                item.id === newItem.id &&
                item.color === newItem.color &&
                item.size === newItem.size
        );

        if (existingItemIndex !== -1) {
            // Item already exists in cart, don't add it again
            setErrorMessage("This product with the selected color and size is already in your cart.");
            return;
        }

        // If item doesn't exist in cart, add it
        const updatedCart = [...existingCart, newItem];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItem(newItem);
        setShowCart(true);
        setErrorMessage(null); // Clear any previous error
    };

    const handleUpdateQuantity = (newQty) => {
        if (newQty > stockValue) return;
        setQuantity(newQty);
        setCartItem((prev) => (prev ? { ...prev, quantity: newQty } : null));
    };

    const handleCloseCart = () => {
        setShowCart(false);
    };

    return (
        <div className="container my-5">
            <div className="row">
                {/* Thumbnails */}
                <div className="col-md-1 d-flex flex-column align-items-center gap-2">
                    {product.image.map((img, i) => (
                        <img
                            key={i}
                            src={`/${img}`}
                            alt="thumb"
                            onClick={() => setMainImage(img)}
                            style={{
                                width: "50px",
                                height: "60px",
                                objectFit: "cover",
                                cursor: "pointer",
                                border: mainImage === img ? "2px solid black" : "1px solid #ccc",
                            }}
                        />
                    ))}
                </div>

                {/* Main Image */}
                <div className="col-md-5 position-relative" style={{ height: "500px" }}>
                    {selected.color && selected.size && (
                        <div
                            className="position-absolute top-0 m-2 bg-light py-2 rounded shadow-sm"
                            style={{ width: "150px", textAlign: "center" }}
                        >
                            <Stock value={stockValue} />
                        </div>
                    )}
                    <img
                        src={`/${mainImage}`}
                        alt={product.name}
                        className="img-fluid"
                        style={{
                            borderRadius: "10px",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>

                {/* Product Info */}
                <div
                    className="col-md-6 d-flex flex-column justify-content-between"
                    style={{ height: "500px" }}
                >
                    <div>
                        <h5 className="text-uppercase text-muted">{product.brand || "ZVEZDA"}</h5>
                        <h2>{product.name}</h2>
                        <h6 className="text-secondary">Category: {product.category || "Category"}</h6>

                        {/* Star Rating */}
                        <div className="my-3">
                            <strong>Your Rating: </strong>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        color: star <= rating ? "#ffc107" : "#e4e5e9",
                                        fontSize: "1.5rem",
                                    }}
                                    role="button"
                                    aria-label={`${star} star`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <Price value={product.price} oldValue={product.oldPrice} />

                        {/* Size */}
                        <div className="my-3">
                            <strong>Size:</strong>
                            <div className="d-flex gap-2 mt-2">
                                {["S", "M", "L", "XL"].map((sz) => (
                                    <Button
                                        key={sz}
                                        variant={selected.size === sz ? "dark" : "outline-secondary"}
                                        size="sm"
                                        onClick={() => setSelected({ ...selected, size: sz })}
                                    >
                                        {sz}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div className="my-3">
                            <strong>Color: {selected.color || "None"}</strong>
                            <div className="d-flex gap-2 mt-2">
                                {Object.keys(product.variants).map((clr, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelected({ ...selected, color: clr })}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            border: selected.color === clr ? "2px solid black" : "1px solid #ccc",
                                            backgroundColor: clr.toLowerCase(),
                                            cursor: "pointer",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div>
                        {/* Error message display */}
                        {errorMessage && (
                            <div className="alert alert-danger mb-3" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        <div className="d-flex gap-2 align-items-center mt-3">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={!selected.color || !selected.size || quantity <= 1}
                            >
                                −
                            </Button>
                            <span>{quantity}</span>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setQuantity((q) => q + 1)}
                                disabled={
                                    !selected.color ||
                                    !selected.size ||
                                    (stockValue !== null && quantity >= stockValue)
                                }
                            >
                                +
                            </Button>

                            <Button
                                variant="dark"
                                className="ms-3"
                                onClick={handleAddToCart}
                                disabled={!selected.color || !selected.size || stockValue === 0}
                                style={{ width: "250px" }}
                            >
                                Add to Cart
                            </Button>
                        </div>

                        <p className="text-dark mt-4">
                            <strong>Free Shipping:</strong> On all orders over 800
                        </p>
                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <CartSideBar
                    item={cartItem}
                    stockValue={stockValue}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClose={handleCloseCart}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;