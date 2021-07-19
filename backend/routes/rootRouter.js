// ********************** Routes **************************
import express from "express";
const router = express.Router();
import orderController from "../controllers/orderController.js";

router.route("/").get(orderController.wellcome);

router.route("/api/pickjob").post(orderController.getToken, orderController.createPickJob);
router.route("/api/orders").post(orderController.getToken, orderController.createOrder);
router.route("/api/update_status").patch(orderController.getToken, orderController.updateStatus);
router.route("/api/get_pickjob_id/:id").get(orderController.getToken,
                                        orderController.getPickjob, // get the specific pickjob with id
                                        orderController.updateStatus, // update it's status into in progress
                                        orderController.perfectPick //PATCH call to close the Pickjob and perfect pick all the lines 
                                        );
export default router;