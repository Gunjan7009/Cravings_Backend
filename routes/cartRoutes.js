const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Define cart-related routes
router.post("/additem", authMiddleware, cartController.addItem);
router.post("/removeitem", authMiddleware, cartController.removeItem);
router.delete("/clearitem", authMiddleware, cartController.clearCart);
router.get("/getcart", authMiddleware, cartController.getCart);
router.post("/share", authMiddleware, cartController.shareCart);
router.get("/shared/:sharedLinkId", cartController.getSharedCart);

module.exports = router;
