import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Stock from "../Common/Stock";
import Price from "../Common/Price";

const ProductCard = ({
    product,
    imageIndex,
    handlePrev,
    handleNext,
    selected,
    setSelectedOptions,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!product.dealEndTime) {
            setTimeLeft("");
            return;
        }

        const updateCountdown = () => {
            const now = new Date().getTime();
            const endTime = new Date(product.dealEndTime).getTime();
            const diff = endTime - now;

            if (isNaN(endTime) || diff <= 0) {
                setTimeLeft("Deal ended");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        };

        updateCountdown(); // run once immediately
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [product.dealEndTime]);

    const images = product.image || product.images || [];
    const totalImages = images.length || 1;
    const validIndex = imageIndex >= 0 && imageIndex < totalImages ? imageIndex : 0;
    const imageSrc = images[validIndex] || "https://via.placeholder.com/300";

    const stockValue =
        selected?.color && selected?.size
            ? product?.variants?.[selected.color]?.[selected.size] ?? 0
            : null;

    const handleNavigate = () => {
        const basePath = location.pathname.includes("/deals")
            ? "/deal"
            : "/product";
        navigate(`${basePath}/${product.id}`);
    };

    return (
        <div className="card shadow-sm">
            <div className="image-container position-relative">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover", cursor: "pointer" }}
                    onClick={handleNavigate}
                />

                {product.oldPrice && product.discount && (
                    <div
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "red",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            userSelect: "none",
                            zIndex: 10,
                        }}
                    >
                        -{product.discount}%
                    </div>
                )}

                <Button
                    variant="light"
                    className="position-absolute top-50 start-0 translate-middle-y"
                    style={{ opacity: 0.7 }}
                    onClick={() => handlePrev(product.id, images)}
                >
                    ‹
                </Button>

                <Button
                    variant="light"
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={{ opacity: 0.7 }}
                    onClick={() => handleNext(product.id, images)}
                >
                    ›
                </Button>

                {selected?.color && selected?.size && (
                    <div className="position-absolute top-0 start-0 m-2 bg-white px-2 py-1 rounded shadow-sm">
                        <Stock value={stockValue} />
                    </div>
                )}

                <div className="position-absolute bottom-0 end-0 m-2 bg-dark text-white px-2 py-1 rounded small shadow-sm">
                    {imageIndex + 1}/{totalImages}
                </div>

                {/* Countdown timer */}
                {timeLeft && (
                    <div
                        className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-3 shadow-sm"
                        style={{
                            backgroundColor: "lightgray", // semi-transparent dark background
                            color: "gray",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                            zIndex: 15,
                            minWidth: "110px",
                            textAlign: "center",
                        }}
                    >
                        {timeLeft === "Deal ended" ? "Deal ended" : ` ${timeLeft}`}
                    </div>
                )}


                {timeLeft === "Deal ended" && (
                    <div
                        className="position-absolute top-0 start-50 translate-middle-x m-2 px-2 py-1 rounded shadow-sm"
                        style={{
                            backgroundColor: "gray",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            userSelect: "none",
                            zIndex: 20,
                        }}
                    >
                        Deal ended
                    </div>
                )}
            </div>

            <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>

                {/* Color selector */}
                <div className="my-2 text-start">
                    <small className="d-block fw-semibold mb-1">Color:</small>
                    <div className="d-flex gap-2">
                        {Object.keys(product.variants).map((clr, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    setSelectedOptions((prev) => ({
                                        ...prev,
                                        [product.id]: {
                                            ...prev[product.id],
                                            color: clr,
                                        },
                                    }))
                                }
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    border: "2px solid",
                                    borderColor: selected?.color === clr ? "#000" : "#ccc",
                                    backgroundColor: clr.toLowerCase(),
                                    cursor: "pointer",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Size selector */}
                <div className="my-3 text-start">
                    <small className="d-block fw-semibold mb-1">Size:</small>
                    <div className="d-flex gap-2 flex-wrap">
                        {["S", "M", "L", "XL"].map((sz) => (
                            <button
                                key={sz}
                                className={`btn btn-sm ${selected?.size === sz
                                        ? "btn-dark text-white"
                                        : "btn-outline-secondary"
                                    }`}
                                onClick={() =>
                                    setSelectedOptions((prev) => ({
                                        ...prev,
                                        [product.id]: {
                                            ...prev[product.id],
                                            size: sz,
                                        },
                                    }))
                                }
                                style={{ minWidth: "45px" }}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="price-shop d-flex justify-content-between align-items-center w-100">
                    <Price value={product.price} oldValue={product.oldPrice} />
                    <Button
                        variant="light"
                        size="sm"
                        className="btn btn-outline-dark"
                        onClick={handleNavigate}
                    >
                        View Product
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
