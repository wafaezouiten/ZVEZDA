import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert, Table, Image, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminEditProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [validated, setValidated] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    // Category loading/error
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState('');

    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        status: '',
        colors: [],
        sizes: [],
        inventory: [],
        images: []
    });

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

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError('');
            try {
                const response = await api.get('categories');
                setCategories(response.data);
            } catch (err) {
                setCategoriesError('Failed to load categories');
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Load product from location.state
    useEffect(() => {
        if (location.state?.product) {
            const existingProduct = location.state.product;
            const colors = existingProduct.variants?.map(v => v.color) || existingProduct.colors || [];
            const sizes = existingProduct.variants?.[0]?.sizes?.map(s => s.size) || existingProduct.sizes || [];
            const inventory = existingProduct.variants?.flatMap(variant =>
                variant.sizes.map(size => ({
                    color: variant.color,
                    size: size.size,
                    stock: size.stock
                }))
            ) || existingProduct.inventory || [];
            setProduct({
                ...existingProduct,
                colors,
                sizes,
                inventory,
                images: existingProduct.images || []
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value;
        const array = value.split(',').map(item => item.trim()).filter(item => item);
        setProduct(prev => ({ ...prev, [field]: array }));
        if (field === 'colors' || field === 'sizes') {
            setProduct(prev => ({ ...prev, inventory: [] }));
        }
    };

    const handleStockChange = (color, size, stock) => {
        const newInventory = [...product.inventory];
        const existingIndex = newInventory.findIndex(
            item => item.color === color && item.size === size
        );
        if (existingIndex >= 0) {
            newInventory[existingIndex].stock = parseInt(stock) || 0;
        } else {
            newInventory.push({ color, size, stock: parseInt(stock) || 0 });
        }
        setProduct(prev => ({
            ...prev,
            inventory: newInventory,
            status: calculateStockStatus(calculateTotalStock(newInventory))
        }));
    };

    const handleImageUpload = (e) => {
        if (uploading) return;
        const files = e.target.files;
        if (files.length + product.images.length > 10) {
            setError('You can upload a maximum of 10 images');
            return;
        }
        setUploading(true);
        // Simulate image upload
        setTimeout(() => {
            const newImages = [...product.images];
            Array.from(files).forEach(file => {
                newImages.push({
                    url: URL.createObjectURL(file),
                    file
                });
            });
            setProduct(prev => ({ ...prev, images: newImages }));
            setUploading(false);
        }, 1000);
    };

    const removeImage = (index) => {
        const newImages = [...product.images];
        newImages.splice(index, 1);
        setProduct(prev => ({ ...prev, images: newImages }));
    };

    const calculateTotalStock = (inventory = product.inventory) => {
        return inventory.reduce((total, item) => total + (item.stock || 0), 0);
    };

    const calculateStockStatus = (totalStock) => {
        if (totalStock === 0) return 'Out of Stock';
        if (totalStock <= 5) return 'Critical Stock';
        if (totalStock <= 15) return 'Late Stock';
        return 'In Stock';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (
            form.checkValidity() === false ||
            product.colors.length === 0 ||
            product.sizes.length === 0
        ) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        // Convert back to variants format if needed
        const variants = product.colors.map(color => ({
            color,
            sizes: product.sizes.map(size => {
                const inventoryItem = product.inventory.find(
                    item => item.color === color && item.size === size
                );
                return {
                    size,
                    stock: inventoryItem ? inventoryItem.stock : 0
                };
            })
        }));
        const totalStock = calculateTotalStock();
        const status = calculateStockStatus(totalStock);

        const updatedProduct = {
            ...product,
            variants,
            stock: totalStock,
            status
        };

        setUploading(true);
        try {
            // Replace this with your actual API call for updating the product:
            // await api.put(`products/${product._id}`, updatedProduct);
            setTimeout(() => {
                setUploading(false);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/admin/products', {
                        state: { updatedProduct }
                    });
                }, 2000);
            }, 1500);
        } catch (err) {
            setError('Failed to update product');
            setUploading(false);
        }
    };

    if (!location.state?.product) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">No product data found.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Edit Product</h1>
            {success && (
                <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                    Product updated successfully!
                </Alert>
            )}
            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a product name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="productPrice">
                        <Form.Label>Price (Mad)</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid price.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="productCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            disabled={categoriesLoading}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat._id || cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Control>
                        {categoriesLoading && <div><Spinner animation="border" size="sm" /> Loading...</div>}
                        {categoriesError && <div className="text-danger">{categoriesError}</div>}
                        <Form.Control.Feedback type="invalid">
                            Please select a category.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="productStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly
                            value={product.status}
                            className={`fw-bold ${
                                product.status === 'In Stock'
                                    ? 'text-success'
                                    : product.status === 'Late Stock'
                                    ? 'text-warning'
                                    : product.status === 'Critical Stock'
                                    ? 'text-danger'
                                    : 'text-secondary'
                            }`}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="productColors">
                        <Form.Label>
                            Colors <span style={{ color: 'lightgrey' }}>(comma separated)</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={product.colors.join(', ')}
                            onChange={e => handleArrayChange(e, 'colors')}
                            placeholder="e.g., Red, Blue, Green"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide at least one color.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="productSizes">
                        <Form.Label>
                            Sizes <span style={{ color: 'lightgrey' }}>(comma separated)</span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={product.sizes.join(', ')}
                            onChange={e => handleArrayChange(e, 'sizes')}
                            placeholder="e.g., S, M, L, XL"
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide at least one size.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {product.colors.length > 0 && product.sizes.length > 0 && (
                    <Form.Group className="mb-4" controlId="inventoryManagement">
                        <Form.Label>Inventory Management</Form.Label>
                        <div className="table-responsive">
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>Color \ Size</th>
                                        {product.sizes.map(size => (
                                            <th key={size}>{size}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.colors.map(color => (
                                        <tr key={color}>
                                            <td>{color}</td>
                                            {product.sizes.map(size => {
                                                const inventoryItem = product.inventory.find(
                                                    item => item.color === color && item.size === size
                                                );
                                                const stockValue = inventoryItem ? inventoryItem.stock : 0;
                                                return (
                                                    <td key={`${color}-${size}`}>
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            value={stockValue}
                                                            onChange={e =>
                                                                handleStockChange(color, size, e.target.value)
                                                            }
                                                            style={{ width: '70px' }}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Form.Group>
                )}
                <Form.Group className="mb-3" controlId="productImages">
                    <Form.Label>Upload Images (Max: 10)</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                    <div className="d-flex flex-wrap mt-3">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="me-2 mb-2 text-center">
                                <Image src={img.url} thumbnail height={75} width={75} />
                                <div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeImage(idx)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={uploading}>
                    {uploading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Form>
        </Container>
    );
};

export default AdminEditProduct;
