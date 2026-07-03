import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const clearAuthData = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setError("");
    clearAuthData();

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          return;
        }

        // Sign Up API call
        const signUpData = {
          email,
          username,
          password,
        };
        

        const response = await axios.post(
          "http://localhost:5000/api/auth/signUp",
          signUpData
        );

        const user = response.data.user || response.data;
        const token =
          response.data.token || response.data.Token || response.data.authToken;

        localStorage.setItem("userProfile", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", "user");
        window.dispatchEvent(new Event("storage"));

        navigate("/");
      } else {
        // Sign In API call
        const signInData = { email, password };
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          signInData
        );

        const user = response.data.user || response.data;
        const token = response.data.token || response.data.authToken;

        console.log("Logged in user:", user);

        localStorage.setItem("userProfile", JSON.stringify(user));
        localStorage.setItem("authToken", token);

        const role = user.isAdmin ? "admin" : "user";
        localStorage.setItem("role", role);
        window.dispatchEvent(new Event("storage"));

        if (user.isAdmin) {
          navigate("/admin/");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "80%",
          maxWidth: "800px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side - Image */}
        <div
          style={{
            flex: 1,
            background: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="image1.jpg"
            alt="Login Illustration"
            style={{ maxWidth: "100%", height: "auto", padding: "20px" }}
          />
        </div>

        {/* Right Side - Form */}
        <div
          className="form-container"
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 className="text-center fw-bold mb-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username Input */}
            {isSignUp && (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${
                    validated && !username ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username">Username</label>
                <div className="invalid-feedback">Username is required.</div>
              </div>
            )}

            {/* Email Input */}
            <div className="form-floating mb-3">
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${
                  validated && !email ? "is-invalid" : ""
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
            </div>

            {/* Password Input */}
            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${
                  validated && !password ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label htmlFor="password">Password</label>
              <div className="invalid-feedback">
                Password must be at least 6 characters.
              </div>
            </div>

            {/* Confirm Password */}
            {isSignUp && (
              <div className="form-floating mb-3">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${
                    validated && confirmPassword !== password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="invalid-feedback">Passwords must match.</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                width: "100%",
                marginTop: "15px",
              }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle Button */}
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <button
                  onClick={toggleForm}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
