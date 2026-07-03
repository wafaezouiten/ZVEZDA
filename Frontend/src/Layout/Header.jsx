import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesDropdown from "../Drop/CategoriesDropdown";
import { FaUserCircle } from "react-icons/fa";

const Header = ({ newArrivalsRef }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Function to load user from localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userProfile");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen to native storage event (cross tab)
    const onStorageChange = (e) => {
      if (e.key === "userProfile") {
        loadUser();
      }
    };

    // Listen to custom event profileUpdated (current tab)
    const onProfileUpdated = () => {
      loadUser();
    };

    window.addEventListener("storage", onStorageChange);
    window.addEventListener("profileUpdated", onProfileUpdated);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("profileUpdated", onProfileUpdated);
    };
  }, []);

  const handleNewArrivalsClick = () => {
    if (window.location.pathname === "/") {
      if (newArrivalsRef?.current) {
        newArrivalsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: "newArrivals" } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setUser(null);
    navigate("/");
    window.dispatchEvent(new Event("storage")); // Notify other tabs/components
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: "39px",
            fontWeight: "bold",
            fontFamily: "Playfair Display, serif",
            color: "black",
            textDecoration: "none",
            marginLeft: "100px",
          }}
        >
          ZVEZDA
        </a>

        <div style={{ display: "flex", alignItems: "center" }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <li style={{ marginRight: "5px", marginTop: "10px" }}>
              <a
                href="/"
                style={{
                  background: "none",
                  border: "none",
                  color: "black",
                  textDecoration: "none",
                  marginRight: "30px",
                }}
              >
                Home
              </a>
            </li>

            <li style={{ marginRight: "15px", marginTop: "5px" }}>
              <CategoriesDropdown />
            </li>

            <li style={{ marginRight: "20px" }}>
              <button
                onClick={handleNewArrivalsClick}
                style={{
                  background: "none",
                  border: "none",
                  color: "black",
                  textDecoration: "none",
                  marginTop: "10px",
                  marginRight: "15px",
                }}
              >
                New Arrivals
              </button>
            </li>

            <li style={{ marginRight: "20px" }}>
              <button
                onClick={() => navigate("/cart")}
                style={{
                  background: "none",
                  border: "none",
                  color: "black",
                  textDecoration: "none",
                  marginTop: "10px",
                  marginRight: "15px",
                }}
              >
                Cart
              </button>
            </li>

            <li>
              {user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "5px",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/urprofile")}
                    />
                  ) : (
                    <FaUserCircle
                      size={30}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/urprofile")}
                    />
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "#5b011a",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                  }}
                >
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
