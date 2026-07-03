import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", fontSize: "2.5rem" }}>
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="mb-4">You have no orders yet.</h4>
          <Button variant="dark" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customer.firstName} {order.customer.lastName}</td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  {/* You can make it dynamic if needed */}
                  <span className="badge bg-success">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
