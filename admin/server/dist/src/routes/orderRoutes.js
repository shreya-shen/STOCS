"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
router.get("/pending", orderController_1.getPendingOrders);
router.get("/completed", orderController_1.getCompletedOrders);
// router.post("/update-status", updateOrderStatus);
router.get("/current-token", orderController_1.getCurrentToken);
exports.default = router;
