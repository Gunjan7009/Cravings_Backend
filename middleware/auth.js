const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/cart");

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.params.sharedLinkId) {
      const cart = await Cart.findOne({
        sharedLinkId: req.params.sharedLinkId,
      });
      if (!cart) {
        return res.status(404).json({ message: "Shared cart not accessible" });
      }
      return next(); // Allow access without token
    }

    if (req.body.token) {
      token = req.body.token;
    }
    // Check if the token is in the request headers
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract the token from the "Bearer <token>" format
    }
 console.log(token);
    if (!token) {
      console.error("No token found in request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    //   Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    console.log("Token expiry time:", decoded.exp);

 
    const user = await User.findById(decoded.id);
    // Find the user by ID from the token payload
    // const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ error: "Please authenticate." });
    }
    req.user = { id: user._id, email: user.email };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please log in again." });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Invalid token. Please provide a valid token." });
    } else {
      return res.status(401).json({ error: "Authentication failed." });
    }
  }
};

module.exports = authMiddleware;
