import { Router } from "express";
import { getPendingOrders, getCompletedOrders, getCurrentToken  } from "../controllers/orderController";

const router = Router();

router.get("/pending", getPendingOrders);
router.get("/completed", getCompletedOrders);
// router.post("/update-status", updateOrderStatus);
router.get("/current-token", getCurrentToken);

export default router;