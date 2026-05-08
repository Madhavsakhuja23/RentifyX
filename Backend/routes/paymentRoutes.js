import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/create-order — Create a Razorpay order (requires auth)
router.post("/create-order", authMiddleware, createOrder);

// POST /api/payments/verify-payment — Verify Razorpay payment signature (requires auth)
router.post("/verify-payment", authMiddleware, verifyPayment);

export default router;
