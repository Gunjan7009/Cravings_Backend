const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

   
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

    const { id } = decoded;
    // Find the user by ID from the token payload
    const user = await User.findById(id);
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

// const jwt = require('jsonwebtoken');

// const authenticateUser = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Unauthorized access" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user info (e.g., `id`) to the request
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };
