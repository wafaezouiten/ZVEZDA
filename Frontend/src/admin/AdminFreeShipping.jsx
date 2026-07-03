import { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const AdminFreeShipping = () => {
  const [amount, setAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("authToken");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/config",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/free-shipping");
        setAmount(data.freeShippingThreshold.toString());
        setIsSaved(true);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load threshold");
      } finally {
        setLoading(false);
      }
    };
    fetchThreshold();
  }, []);

  const handleSaveOrEdit = async () => {
    if (!isSaved) {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        setError("Please enter a valid positive number.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        await api.put("/free-shipping", { freeShippingThreshold: Number(amount) });
        setIsSaved(true);
        setSuccess("Free shipping threshold updated successfully.");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to save threshold");
      } finally {
        setLoading(false);
      }
    } else {
      setIsSaved(false);
      setSuccess(null);
      setError(null);
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">Edit Free Shipping Threshold</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form>
        <Form.Group controlId="freeShippingAmount">
          <Form.Label>Free Shipping Threshold (MAD):</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={isSaved || loading}
          />
        </Form.Group>
        <Button
          variant={isSaved ? "secondary" : "primary"}
          className="mt-3"
          onClick={handleSaveOrEdit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            isSaved ? "Edit" : "Save"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AdminFreeShipping;
