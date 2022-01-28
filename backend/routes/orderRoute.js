const express = require("express");
const { route } = require("express/lib/application");
const { newOrder, getSingOrder, myOrder, getAllOrders, updateOrders, deleteOrder } = require("../../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();



router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingOrder);
router.route("/orders/me").get(isAuthenticatedUser , myOrder);
router.route("/orders").get(isAuthenticatedUser,authorizeRoles("admin") , getAllOrders);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateOrders);
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteOrder);

module.exports = router