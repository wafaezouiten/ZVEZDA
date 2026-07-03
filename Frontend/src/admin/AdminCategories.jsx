import React, { useState, useEffect } from "react";
import { Button, Card, Table, Form, Modal } from "react-bootstrap";
import axios from "axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token 
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

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  },[]);

  const handleCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await api.post("/categories", {
        name: newCategoryName,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await api.put(`/categories/${currentCategory._id}`, {
        name: newCategory,
      });
      setCategories(
        categories.map((category) =>
          category._id === currentCategory._id ? response.data : category
        )
      );
      setShowModal(false);
      setCurrentCategory(null);
      setNewCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${currentCategory._id}`);
      setCategories(
        categories.filter((category) => category._id !== currentCategory._id)
      );
      setShowModal(false);
      setCurrentCategory(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  const openModal = (category, action) => {
    setCurrentCategory(category);
    setNewCategory(category.name);
    setModalAction(action);
    setShowModal(true);
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Card>
      <Card.Header>
        <h4>Categories</h4>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h5>Create new category</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter category name"
                name="category"
                value={newCategoryName}
                onChange={handleCategoryNameChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateCategory}>
              Create
            </Button>
          </Form>
        </div>

        <div className="mb-4">
          <h5>Categories List</h5>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>CATEGORY NAME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => openModal(category, "edit")}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openModal(category, "delete")}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>

      {/* Modal for Edit/Delete */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCategory?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === "edit" ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Edit Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEditCategory}>
                Save Changes
              </Button>
            </>
          ) : modalAction === "delete" ? (
            <>
              <p>Are you sure you want to delete this category?</p>
              <Button variant="danger" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </>
          ) : null}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AdminCategories;