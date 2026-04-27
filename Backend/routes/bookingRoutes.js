import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getRentalHistory } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/history", authMiddleware, getRentalHistory);

export default router;
