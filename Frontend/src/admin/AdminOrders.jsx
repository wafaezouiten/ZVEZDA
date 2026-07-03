import { Table, Dropdown, Badge, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CITY_SHIPPING_PRICES = {
  Casablanca: 30,
  Rabat: 35,
  Marrakech: 40,
  Fes: 45,
  Tangier: 50,
  Agadir: 55,
  Meknes: 45,
  Oujda: 60,
  Kenitra: 40,
  Tetouan: 50,
  Safi: 50,
  Mohammedia: 35,
  Nador: 60,
  Other: 80,
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(null);

  const allowedStatuses = {
    Processing: "warning",
    Delivered: "success",
    Returned: "danger",
  };

  const getStatusFromOrder = (order) => {
    if (order.isReturned) return "Returned";
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Processing";
    return "Processing";
  };

  const token = localStorage.getItem("authToken");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/orders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFreeShippingThreshold = async () => {
    try {
      const response = await api.get("/shipping-threshold");
      setFreeShippingThreshold(response.data.threshold);
    } catch (err) {
      setFreeShippingThreshold(800); 
    }
  };

  useEffect(() => {
    fetchFreeShippingThreshold();
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      setError(null);

      if (newStatus === "Delivered") {
        await api.put(`/orders/${orderId}/pay`, {});
        await api.put(`/orders/${orderId}/deliver`, {});
      } else if (newStatus === "Processing") {
        await api.put(`/orders/${orderId}/pay`, {});
      } else if (newStatus === "Returned") {
        await api.put(`/orders/${orderId}/return`);
      }

      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateItemsTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateShipping = (city, total) =>
    total >= (freeShippingThreshold ?? 800)
      ? 0
      : CITY_SHIPPING_PRICES[city] || CITY_SHIPPING_PRICES["Other"];

  const handleViewDetails = (order) => {
    const itemsTotal = calculateItemsTotal(order.orderItems);
    const shipping = calculateShipping(order.shippingAddress.city, itemsTotal);
    const fullOrder = {
      ...order,
      total: itemsTotal,
      shipping,
      grandTotal: itemsTotal + shipping,
    };

    navigate(
      `/admin/orders/${order._id}?data=${encodeURIComponent(
        JSON.stringify(fullOrder)
      )}`
    );
  };

  return (
    <div className="admin-orders p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Orders</h2>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate("/admin/free-shipping")}
        >
          Edit Free Shipping Threshold
        </Button>
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="mb-0 fw-semibold">Filter by status:</label>
        <Dropdown onSelect={(selected) => setStatusFilter(selected)}>
          <Dropdown.Toggle variant="secondary" size="sm">
            {statusFilter}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            {Object.keys(allowedStatuses).map((status) => (
              <Dropdown.Item key={status} eventKey={status}>
                {status}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>ORDER ID</th>
            <th>DATE</th>
            <th>STATUS</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders
              .filter(
                (order) =>
                  statusFilter === "All" ||
                  getStatusFromOrder(order) === statusFilter
              )
              .map((order) => {
                const status = getStatusFromOrder(order);
                const itemsTotal = calculateItemsTotal(order.orderItems);
                const shipping = calculateShipping(
                  order.shippingAddress.city,
                  itemsTotal
                );
                const grandTotal = itemsTotal + shipping;

                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                          <Badge bg={allowedStatuses[status]}>{status}</Badge>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {Object.entries(allowedStatuses).map(
                            ([statusKey, variant]) => (
                              <Dropdown.Item
                                key={statusKey}
                                onClick={() =>
                                  handleStatusChange(order._id, statusKey)
                                }
                              >
                                <Badge bg={variant}>{statusKey}</Badge>
                              </Dropdown.Item>
                            )
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td>
                      {order.shippingAddress.fullName}
                      <br />
                      <small className="text-muted">
                        {order.shippingAddress.phone}
                      </small>
                    </td>
                    <td>
                      {order.orderItems.length} item
                      {order.orderItems.length > 1 ? "s" : ""}
                      <br />
                      <small>
                        {order.orderItems?.[0]?.name || "No items"}{" "}
                        {order.orderItems?.length > 1 ? "+ more" : ""}
                      </small>
                    </td>
                    <td>{grandTotal.toFixed(2)} MAD</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan="7">Loading orders...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminOrders;
