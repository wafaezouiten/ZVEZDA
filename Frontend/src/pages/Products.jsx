import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import ProductCard from "../Product/ProductCard";
import allProducts from "../data/AllProducts";
import axios from "axios";

const Products = () => {
  const location = useLocation();
  const [category, setCategory] = useState("");
  const [imageIndices, setImageIndices] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
   const [products, setProducts] = useState([]);

  
    // Get auth token (assuming it's stored in localStorage)
    const token = localStorage.getItem("authToken");
  
    // Axios instance with auth header
    const api = axios.create({
      baseURL: "http://localhost:5000/api/",
       headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  
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

    // Fetch allproducts
    const fetchProducts= async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
        setIsLoading(false);
      }
    };
    
    console.log(fetchProducts)
  
    useEffect(() => {
      fetchProducts();
    },[]);
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setCategory(categoryParam || "");
  }, [location]);

  const filteredProducts = category
    ? fetchProducts.filter((product) => product.category === category)
    : fetchProducts;

  const handlePrev = (productId, images) => {
    setImageIndices((prev) => {
      const current = prev[productId] || 0;
      const newIndex = current === 0 ? images.length - 1 : current - 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  const handleNext = (productId, images) => {
    setImageIndices((prev) => {
      const current = prev[productId] || 0;
      const newIndex = current === images.length - 1 ? 0 : current + 1;
      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div className="py-5">
      <Container>
        <h1 className="text-center fw-bold">Products</h1>
        {category && <h2 className="text-center my-4">Category: {category}</h2>}

        <Row className="justify-content-center mt-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id} md={6} lg={4} className="mb-4">
                <ProductCard
                  product={product}
                  imageIndex={imageIndices[product.id] || 0}
                  setImageIndices={setImageIndices}
                  selected={selectedOptions[product.id]}
                  setSelectedOptions={setSelectedOptions}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                />
              </Col>
            ))
          ) : (
            <p className="text-center">No products found in this category.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Products;
