const express = require("express");
const router = express.Router();
const menucontroller = require("../controllers/menuController");

router.post('/addfood', menucontroller.Addfood);
router.get('/receivefood', menucontroller.Receivefood);

module.exports = router;