import React, { useState, useEffect } from "react";
import {
    Card, Container, Row, Col, Button, Badge, Table, Alert, Modal, Form, Spinner
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faChartSimple, faLayerGroup, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showDealModal, setShowDealModal] = useState(false);
    const [productForDeal, setProductForDeal] = useState(null);
    const [dealStartDate, setDealStartDate] = useState('');
    const [dealEndDate, setDealEndDate] = useState('');
    const [dealPercent, setDealPercent] = useState('');
    const [dealError, setDealError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

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

    // Fetch all Products
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get("/products");
            console.log("Raw API Response:", response.data);
            
            // Ensure we have an array
            const productsData = Array.isArray(response.data) ? response.data : [];
            console.log("Products array:", productsData);
            
            setProducts(productsData);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.response?.data?.message || "Failed to fetch products");
            setProducts([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (location.state?.newProduct) {
            const newProduct = location.state.newProduct;
            setProducts(prev => {
                const exists = prev.some(p => p.id === newProduct.id);
                return exists ? prev : [newProduct, ...prev];
            });
            setSuccessMessage(`Product "${newProduct.name}" added!`);
            navigate(location.pathname, { replace: true, state: {} });
        }

        if (location.state?.updatedProduct) {
            const updatedProduct = location.state.updatedProduct;
            setProducts(prev =>
                prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setSuccessMessage(`Product "${updatedProduct.name}" updated!`);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const stockStats = {
        totalProducts: products.length,
        totalCategories: new Set(products.map(p => p?.category || 'Unknown')).size,
        inStock: products.filter(p => p?.status === "In Stock").length,
        lowStock: products.filter(p => p?.status === "Late Stock").length,
        outOfStock: products.filter(p => p?.status === "Out of Stock").length
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "In Stock":
                return <Badge bg="success">{status}</Badge>;
            case "Late Stock":
                return <Badge bg="warning" text="dark">{status}</Badge>;
            default:
                return <Badge bg="danger">{status}</Badge>;
        }
    };

    // Fixed calculateTotalStock function with comprehensive safety checks
    const calculateTotalStock = (product) => {
        try {
            // Check if product exists
            if (!product) {
                console.warn('Product is null or undefined');
                return 0;
            }

            // Check if product has variants and it's an array
            if (!product.variants) {
                console.warn('Product has no variants property:', product);
                return 0;
            }

            if (!Array.isArray(product.variants)) {
                console.warn('Product variants is not an array:', product.variants);
                return 0;
            }

            // If variants array is empty, return 0
            if (product.variants.length === 0) {
                return 0;
            }
            
            return product.variants.reduce((total, variant) => {
                // Check if variant exists and has sizes
                if (!variant) {
                    console.warn('Variant is null or undefined');
                    return total;
                }

                if (!variant.sizes) {
                    console.warn('Variant has no sizes property:', variant);
                    return total;
                }

                if (!Array.isArray(variant.sizes)) {
                    console.warn('Variant sizes is not an array:', variant.sizes);
                    return total;
                }
                
                return total + variant.sizes.reduce((sum, size) => {
                    // Check if size exists and has stock
                    if (!size) {
                        console.warn('Size is null or undefined');
                        return sum;
                    }

                    if (typeof size.stock !== 'number') {
                        console.warn('Size stock is not a number:', size.stock);
                        return sum;
                    }

                    return sum + size.stock;
                }, 0);
            }, 0);
        } catch (error) {
            console.error('Error in calculateTotalStock:', error, 'Product:', product);
            return 0;
        }
    };

    const handleDeleteClick = (productId) => {
        const product = products.find(p => p.id === productId);
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
    try {
        await api.delete(`/products/${productToDelete.id}`);
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setSuccessMessage(`Product "${productToDelete.name}" deleted successfully!`);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
    } finally {
        setShowDeleteModal(false);
        setProductToDelete(null);
    }
};


    const handleEditProduct = (product) => {
        navigate(`/admin/editproduct/${product.id}`, { state: { product } });
    };

    const getTodayDateString = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const openDealModal = (product) => {
        setProductForDeal(product);
        setDealError('');
        if (product.deal) {
            setDealStartDate(product.deal.startDate || getTodayDateString());
            setDealEndDate(product.deal.endDate || getTodayDateString());
            setDealPercent(product.deal.percent || '');
        } else {
            setDealStartDate(getTodayDateString());
            setDealEndDate(getTodayDateString());
            setDealPercent('');
        }
        setShowDealModal(true);
    };

    const saveDeal = async () => {
        try {
            // Validate inputs
            if (!dealStartDate || !dealEndDate || !dealPercent) {
                setDealError('All fields are required');
                return;
            }
            
            if (new Date(dealEndDate) < new Date(dealStartDate)) {
                setDealError('End date must be after start date');
                return;
            }
            
            const percent = Number(dealPercent);
            if (isNaN(percent) || percent < 0 || percent > 100) {
                setDealError('Discount must be between 0 and 100');
                return;
            }

            // Update deal on backend
            await api.put(`/products/${productForDeal.id}/deal`, {
                startDate: dealStartDate,
                endDate: dealEndDate,
                percent: percent
            });

            // Update local state
            setProducts(prev =>
                prev.map(p =>
                    p.id === productForDeal.id
                        ? { 
                            ...p, 
                            deal: { 
                                startDate: dealStartDate, 
                                endDate: dealEndDate, 
                                percent: percent 
                            } 
                        }
                        : p
                )
            );
            
            setSuccessMessage(`Deal set for product "${productForDeal.name}"`);
            setShowDealModal(false);
            setProductForDeal(null);
        } catch (err) {
            setDealError(err.response?.data?.message || "Failed to save deal");
        }
    };

    return (
        <Container fluid>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        {isLoading ? <Spinner size="sm" /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Deal Modal */}
            <Modal show={showDealModal} onHide={() => setShowDealModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Deal for <strong>{productForDeal?.name}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {dealError && <Alert variant="danger">{dealError}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Deal Start Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={dealStartDate} 
                                onChange={e => setDealStartDate(e.target.value)} 
                                min={getTodayDateString()}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deal End Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={dealEndDate} 
                                onChange={e => setDealEndDate(e.target.value)} 
                                min={dealStartDate || getTodayDateString()}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Discount Percentage (%)</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={dealPercent} 
                                onChange={e => setDealPercent(e.target.value)} 
                                min="0" 
                                max="100" 
                                placeholder="Enter discount percentage"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDealModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveDeal}>
                        {isLoading ? <Spinner size="sm" /> : 'Save Deal'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col><h1>Products</h1><p className="text-muted">Manage your product inventory</p></Col>
                <Col className="text-end">
                    <Link to="/admin/newproduct" className="btn btn-primary">+ Add new product</Link>
                </Col>
            </Row>

            {successMessage && (
                <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Row className="mb-4 g-4">
                <Col md={6} lg={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <FontAwesomeIcon icon={faBox} size="lg" style={{ color: "lightblue" }} />
                            <p className="text-muted mb-0">Total Products</p>
                            <h5>{stockStats.totalProducts}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <FontAwesomeIcon icon={faLayerGroup} size="lg" style={{ color: "lightgreen" }} />
                            <p className="text-muted mb-0">Categories</p>
                            <h5>{stockStats.totalCategories}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <FontAwesomeIcon icon={faChartSimple} size="lg" style={{ color: "#ffc107" }} />
                            <p className="text-muted mb-0">In Stock</p>
                            <h5>{stockStats.inStock}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <FontAwesomeIcon icon={faTriangleExclamation} size="lg" style={{ color: "red" }} />
                            <p className="text-muted mb-0">Out of Stock</p>
                            <h5>{stockStats.outOfStock}</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Products Table */}
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Total Stock</th>
                            <th>Status</th>
                            <th>Deal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product, index) => {
                                // Add safety check for each product
                                if (!product) {
                                    console.warn(`Product at index ${index} is null/undefined`);
                                    return null;
                                }
                                
                                return (
                                    <tr key={product.id || index}>
                                        <td>{product.name || 'Unknown'}</td>
                                        <td>{product.category?.name || 'Unknown'}</td>
                                        <td>{calculateTotalStock(product)}</td>
                                        <td>{getStatusBadge(product.status || 'Unknown')}</td>
                                        <td>
                                            {product.deal
                                                ? `${product.deal.percent}% (${product.deal.startDate} to ${product.deal.endDate})`
                                                : "No Deal"}
                                        </td>
                                        <td>
                                            <Button size="sm" variant="outline-primary" onClick={() => handleEditProduct(product)}>Edit</Button>{' '}
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDeleteClick(product.id)}>Delete</Button>{' '}
                                            <Button size="sm" variant="outline-warning" onClick={() => openDealModal(product)}>
                                                {product.deal ? 'Update Deal' : 'Set Deal'}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminProducts;