import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Nav, Button } from "react-bootstrap";
import {
  HouseDoor,
  Bag,
  Grid,
  List,
  People,
  BoxArrowRight,
} from "react-bootstrap-icons";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage"));
    navigate("/"); 
  };

  const navItems = [
    { path: "/admin", icon: <HouseDoor />, label: "Dashboard" },
    { path: "/admin/products", icon: <Bag />, label: "Products" },
    { path: "/admin/categories", icon: <Grid />, label: "Categories" },
    { path: "/admin/orders", icon: <List />, label: "Orders" },
    { path: "/admin/users", icon: <People />, label: "Users" },
  ];

  return (
    <>
      <Container
        fluid
        className="px-0 d-flex"
        style={{ minHeight: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar - Fixed */}
        <div
          className="d-none d-lg-flex flex-column bg-white text-dark shadow-sm"
          style={{
            width: "250px",
            position: "fixed",
            height: "100vh",
            zIndex: 1000,
          }}
        >
          <div className="p-3 border-bottom">
            <h4 className="mb-0">ZVEZDA Admin</h4>
          </div>

          <Nav
            className="flex-column flex-grow-1 p-3"
            style={{ overflowY: "auto" }}
          >
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                active={location.pathname === item.path}
                className={`mb-2 rounded-3 ${
                  location.pathname === item.path
                    ? "bg-light text-dark fw-bold"
                    : "text-dark"
                }`}
                style={{ padding: "10px" }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">{item.icon}</span>
                  {item.label}
                </div>
              </Nav.Link>
            ))}
          </Nav>

          <div className="p-3 border-top">
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="w-100 d-flex align-items-center justify-content-center"
            >
              <BoxArrowRight className="me-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <main
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f8f9fa",
            marginLeft: "250px",
            width: "calc(100% - 250px)",
            overflowY: "auto",
            height: "100vh",
          }}
        >
          {children}
        </main>
      </Container>
    </>
  );
};

export default AdminLayout;
