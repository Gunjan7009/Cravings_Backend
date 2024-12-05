const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Define cart-related routes
router.post("/additem", cartController.addItem);
router.post("/removeitem", cartController.removeItem);
router.delete("/clearitem", cartController.clearCart);
router.get("/getcart", cartController.getCart);
router.post("/share", authMiddleware, cartController.shareCart);
router.get("/shared/:sharedLinkId", cartController.getSharedCart);



module.exports = router;
