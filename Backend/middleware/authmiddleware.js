const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token reçu:", token);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Erreur de vérification JWT:", error.message);
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    console.log("Pas de token dans l'authorization header");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, admin };
