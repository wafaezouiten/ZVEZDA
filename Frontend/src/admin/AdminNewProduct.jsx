import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Image, Table } from 'react-bootstrap';

const AdminNewProduct = ({ existingProducts = [], setProducts }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Categories from API
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState('');

    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        colors: [],
        sizes: [],
        inventory: [],
        images: [],
    });

    const [validated, setValidated] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

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

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError('');
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (err) {
                setCategoriesError('Failed to load categories');
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Handlers (unchanged)...

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
        const { value } = e.target;
        const newArray = value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '');

        setProduct((prev) => {
            const isColors = field === 'colors';
            const updatedDimension = newArray;
            const otherDimension = isColors ? prev.sizes : prev.colors;

            const existingInventoryMap = new Map();
            prev.inventory.forEach((item) => {
                existingInventoryMap.set(`${item.color}-${item.size}`, item.stock);
            });

            const newInventory = updatedDimension.flatMap((newItem) =>
                otherDimension.map((dimItem) => {
                    const color = isColors ? newItem : dimItem;
                    const size = isColors ? dimItem : newItem;
                    const key = `${color}-${size}`;
                    return {
                        color,
                        size,
                        stock: existingInventoryMap.get(key) || 0,
                    };
                })
            );

            return {
                ...prev,
                [field]: newArray,
                inventory: newInventory,
            };
        });
    };

    const handleStockChange = (color, size, value) => {
        setProduct((prev) => {
            const inventory = [...prev.inventory];
            const index = inventory.findIndex(
                (item) => item.color === color && item.size === size
            );

            if (index >= 0) {
                inventory[index] = {
                    ...inventory[index],
                    stock: parseInt(value) || 0,
                };
            } else {
                inventory.push({ color, size, stock: parseInt(value) || 0 });
            }

            return { ...prev, inventory };
        });
    };

    const handleImageUpload = async (e) => {
        // unchanged image upload logic
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('Some files are too large (max 5MB each)');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const uploadedImages = await Promise.all(
                files.map(
                    (file) =>
                        new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                resolve({
                                    name: file.name,
                                    url: event.target.result,
                                    file,
                                });
                            };
                            reader.readAsDataURL(file);
                        })
                )
            );

            setProduct((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedImages].slice(0, 10),
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setProduct((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const calculateTotalStock = () => {
        return product.inventory.reduce((total, item) => total + (item.stock || 0), 0);
    };

    // Submit with POST
   const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
        setValidated(true);
        return;
    }

    try {
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('category', product.category);
        formData.append('price', product.price);
        formData.append('stock', calculateTotalStock());
        
        // Add variants data
        const variants = product.colors.flatMap(color => 
            product.sizes.map(size => ({
                color,
                sizes: [{
                    size,
                    stock: product.inventory.find(i => i.color === color && i.size === size)?.stock || 0
                }]
            }))
        );
        formData.append('variants', JSON.stringify(variants));
        
        // Add all images
        product.images.forEach((img, index) => {
            formData.append(`images`, img.file);
        });

        setUploading(true);
        const response = await api.post('products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setSuccess(true);
        // Optionally reset form or redirect
        setTimeout(() => navigate('/admin/products'), 2000);
    } catch (error) {
        console.error('Error creating product:', error);
        setError(error.response?.data?.message || 'Failed to create product');
    } finally {
        setUploading(false);
    }
};


    return (
        <Container className="py-4">
            <h1 className="mb-4">Add New Product</h1>

            {success && (
                <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                    Product created successfully!
                </Alert>
            )}

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            {categoriesLoading ? (
                <p>Loading categories...</p>
            ) : categoriesError ? (
                <Alert variant="danger">{categoriesError}</Alert>
            ) : (
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
                            <Form.Label>Price (MAD)</Form.Label>
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
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    // if category is object, adjust accordingly
                                    <option
                                        key={category.id || category}
                                        value={category.name || category}
                                    >
                                        {category.name || category}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Please select a category.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="totalStock">
                            <Form.Label>Total Stock</Form.Label>
                            <Form.Control
                                type="text"
                                readOnly
                                value={calculateTotalStock()}
                                className="fw-bold"
                            />
                        </Form.Group>
                    </Row>

                    {/* ... rest of your form unchanged ... */}

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="productColors">
                            <Form.Label>
                                Colors <span className="text-muted">(comma separated)</span>
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                onChange={(e) => handleArrayChange(e, 'colors')}
                                placeholder="e.g., Red, Blue, Green"
                                value={product.colors.join(', ')}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter at least one color.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="productSizes">
                            <Form.Label>
                                Sizes <span className="text-muted">(comma separated)</span>
                            </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                onChange={(e) => handleArrayChange(e, 'sizes')}
                                placeholder="e.g., S, M, L, XL"
                                value={product.sizes.join(', ')}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter at least one size.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Size</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.inventory.map(({ color, size, stock }) => (
                                <tr key={`${color}-${size}`}>
                                    <td>{color}</td>
                                    <td>{size}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={stock}
                                            onChange={(e) =>
                                                handleStockChange(color, size, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Form.Group controlId="productImages" className="mb-3">
                        <Form.Label>Upload Images (max 10)</Form.Label>
                        <Form.Control
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        <Form.Text className="text-muted">
                            Maximum 5MB per image.
                        </Form.Text>
                    </Form.Group>

                    <Row className="mb-3">
                        {product.images.map((img, index) => (
                            <Col xs={3} key={index} className="mb-2">
                                <Image
                                    src={img.url}
                                    alt={`Uploaded ${index + 1}`}
                                    thumbnail
                                    fluid
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="mt-1"
                                    onClick={() => removeImage(index)}
                                >
                                    Remove
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    <Button type="submit" disabled={uploading}>
                        {uploading ? 'Submitting...' : 'Add Product'}
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default AdminNewProduct;
