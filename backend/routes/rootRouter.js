const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.route("/").get(orderController.willcome);

router.route("/api/pickjob").post(orderController.getToken ,orderController.createOrder);

// router.route("/api/create/token").post(orderController.token);

module.exports = router;
