import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, Badge, Form, Alert, Spinner, Card, Button,
    Modal, ListGroup, Container, Row, Col
} from 'react-bootstrap';
import { Eye } from 'react-bootstrap-icons';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const token = localStorage.getItem("authToken");

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('users/');
                
                const transformedUsers = response.data.map(user => ({
                    ...user,
                    firstName: user.username.split(' ')[0] || user.username,
                    lastName: user.username.split(' ')[1] || '',
                    role: user.isAdmin ? 'admin' : 'user',
                    status: user.isBlocked ? 'blocked' : 'active',
                    id: user._id,  
                }));

                setUsers(transformedUsers);
                setLoading(false);
            } catch (err) {
                setError('Failed to load users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleViewDetails = async (user) => {
        try {
            const response = await api.get(`users/profile/${user.id}`);
            const u = response.data;
            const transformedUser = {
                ...u,
                firstName: u.username.split(' ')[0] || u.username,
                lastName: u.username.split(' ')[1] || '',
                role: u.isAdmin ? 'admin' : 'user',
                status: u.isBlocked ? 'blocked' : 'active',
                id: u._id,
            };
            setSelectedUser(transformedUser);
            setShowDetailsModal(true);
        } catch (err) {
            setError('Failed to fetch user details');
        }
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="m-3">{error}</Alert>;
    }

    return (
        <div className="p-3">
            <h2 className="mb-4">User Management</h2>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search users..."
                                className="me-2"
                                style={{ width: '250px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Form.Select
                                style={{ width: '150px' }}
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                            </Form.Select>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Table striped bordered hover className="mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={user.status === 'active' ? 'success' : 'warning'}>
                                    {user.status}
                                </Badge>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                {user.role === 'user' && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleViewDetails(user)}
                                        title="View details"
                                    >
                                        <Eye />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showDetailsModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedUser && (
                        <Container>
                            <Row className="mb-4 align-items-center">
                                <Col xs="auto">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '70px', height: '70px', fontSize: '28px', fontWeight: '700' }}
                                    >
                                        {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                                    </div>
                                </Col>
                                <Col>
                                    <h3 className="mb-1">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-muted mb-0">{selectedUser.email}</p>
                                    {selectedUser.phone && <p className="text-muted">{selectedUser.phone}</p>}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} className="mb-3">
                                    <Card className="shadow-sm border-0">
                                        <Card.Body>
                                            <Card.Title className="mb-3">Basic Information</Card.Title>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item><strong>Name:</strong> {selectedUser.firstName}</ListGroup.Item>
                                                <ListGroup.Item><strong>Email:</strong> {selectedUser.email}</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <Card className="shadow-sm border-0">
                                        <Card.Body>
                                            <Card.Title className="mb-3">Additional Information</Card.Title>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    <strong>Role:</strong>{' '}
                                                    <Badge bg={selectedUser.role === 'admin' ? 'primary' : 'secondary'} className="ms-2">
                                                        {selectedUser.role}
                                                    </Badge>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Status:</strong>{' '}
                                                    <Badge bg={selectedUser.status === 'active' ? 'success' : 'warning'} className="ms-2">
                                                        {selectedUser.status}
                                                    </Badge>
                                                </ListGroup.Item>
                                                {selectedUser.address && (
                                                    <ListGroup.Item><strong>Address:</strong> {selectedUser.address}</ListGroup.Item>
                                                )}
                                                <ListGroup.Item>
                                                    <strong>Account Created:</strong>{' '}
                                                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
