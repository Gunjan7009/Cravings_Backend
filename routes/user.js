const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const authMiddleware = require("../middleware/auth");


router.put("/user",authMiddleware, userController.updatingUser);
router.post("/user/card",authMiddleware, userController.addCards);
router.put("/user/card",authMiddleware, userController.addCards);
router.delete("/user/card", authMiddleware, userController.deleteCards)
router.post("/user/address",authMiddleware, userController.addAddress);
router.get("/users", userController.getAllUsers);
router.get("/user/profile", authMiddleware, userController.getUserProfile);
router.patch("/user/profiling", authMiddleware, userController.updateUserProfile);
router.post("/user/addressdetails", authMiddleware, userController.addOrUpdateAddress);
router.put("/user/addressdetails", authMiddleware, userController.addOrUpdateAddress);
router.delete("/user/addressdetails", authMiddleware, userController.deleteAddress);
router.get("/user/addressesdetails", authMiddleware, userController.getAddresses);


module.exports = router;
