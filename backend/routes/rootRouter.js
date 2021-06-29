// ********************** Routes **************************
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.route("/").get(orderController.wellcome);

router.route("/api/pickjob").post(orderController.getToken ,orderController.createOrder);

module.exports = router;
