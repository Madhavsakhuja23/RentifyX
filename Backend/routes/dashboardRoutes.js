import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getDashboardRevenue,
  getDashboardActivity,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/revenue", authMiddleware, getDashboardRevenue);
router.get("/activity", authMiddleware, getDashboardActivity);

export default router;
