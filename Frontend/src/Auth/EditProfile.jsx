import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCamera } from 'react-icons/fa';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Loading user profile from localStorage");
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("User loaded:", parsedUser);
      } catch (error) {
        console.error("Error parsing userProfile from localStorage:", error);
        navigate('/auth');
      }
    } else {
      console.log("No userProfile found, redirecting to /auth");
      navigate('/auth');
    }
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(user));
    setSuccess(true);

    // Dispatch custom event for current tab components to listen
    window.dispatchEvent(new Event('profileUpdated'));

    setTimeout(() => {
      setSuccess(false);
      navigate('/urprofile');
    }, 1500);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <p>Loading...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          You need to be logged in to view this page. Redirecting to login...
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                  Profile updated successfully!
                </Alert>
              )}
              <Row>
                <Col md={4} className="text-center mb-3">
                  <div className="position-relative d-inline-block">
                    <Image
                      src={user.avatar || 'https://via.placeholder.com/150?text=Avatar'}
                      roundedCircle
                      fluid
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      alt="User avatar"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
                      style={{ cursor: 'pointer' }}
                      title="Change Avatar"
                    >
                      <FaCamera size={18} />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="d-none"
                    />
                  </div>
                  <h5 className="mt-3">{user.name || 'Your Name'}</h5>
                  <p className="text-muted">{user.email || 'your.email@example.com'}</p>

                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/urprofile')}
                      className="mb-2"
                    >
                      Back to Profile
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Save Changes
                    </Button>
                  </div>
                </Col>

                <Col md={8}>
                  <h4 className="mb-4">
                    <FaUserEdit className="me-2" />
                    Edit Profile Information
                  </h4>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>
                        <strong>Name:</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>
                        <strong>Email:</strong>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>
                        <strong>Phone:</strong>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAddress">
                      <Form.Label>
                        <strong>Address:</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3">
                      Save Changes
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
