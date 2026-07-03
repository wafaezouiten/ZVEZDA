import React, { useEffect, useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesDropdown = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    if (category) {
      navigate(`/products?category=${category}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="link"
        id="navbarDropdown"
        style={{ textDecoration: "none", color: "black", marginRight: "15px" }}
      >
        Categories
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleCategoryClick("")}>All</Dropdown.Item>

        {loading ? (
          <Dropdown.Item disabled>
            <Spinner animation="border" size="sm" /> Loading...
          </Dropdown.Item>
        ) : (
          categories.map((cat) => (
            <Dropdown.Item
              key={cat._id}
              onClick={() => handleCategoryClick(cat.name.toLowerCase())}
            >
              {cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CategoriesDropdown;
