import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load the user data from localStorage when the component mounts
    useEffect(() => {
        const savedUser = localStorage.getItem("userProfile");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            // If no user is logged in, redirect to login page
            navigate("/auth");
        }
        setLoading(false);
    }, [navigate]);

    if (loading) {
        return <Container className="my-5"><p>Loading...</p></Container>;
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
                            <Row>
                                {/* Left: Avatar */}
                                <Col md={4} className="text-center mb-3">
                                    <Image 
                                        src={user.avatar} 
                                        roundedCircle 
                                        fluid 
                                        style={{ width: "150px", height: "150px" }} 
                                    />
                                    <h5 className="mt-3">{user.name || user.username}</h5>
                                    <p className="text-muted">{user.email}</p>
                                    <Link to="/editprofile">
                                        <Button variant="outline-primary">Edit Profile</Button>
                                    </Link>
                                </Col>

                                {/* Right: Info */}
                                <Col md={8}>
                                    <h4 className="mb-4">Profile Information</h4>
                                    <Row>
                                        <Col sm={4}><strong>Name:</strong></Col>
                                        <Col sm={8}>{user.name || ""}</Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col sm={4}><strong>Email:</strong></Col>
                                        <Col sm={8}>{user.email}</Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col sm={4}><strong>Phone:</strong></Col>
                                        <Col sm={8}>{user.phone || ""}</Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col sm={4}><strong>Address:</strong></Col>
                                        <Col sm={8}>{user.address || ""}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;