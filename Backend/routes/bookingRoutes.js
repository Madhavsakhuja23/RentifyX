import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getRentalHistory, checkAvailability, createBooking, getMyBookings } from "../controllers/bookingController.js";

const router = express.Router();

// GET /api/bookings/history — Seller rental history
router.get("/history", authMiddleware, getRentalHistory);

// GET /api/bookings — Current user's bookings
router.get("/", authMiddleware, getMyBookings);

// POST /api/bookings/check-availability
router.post("/check-availability", checkAvailability);

// POST /api/bookings — Create booking (requires auth)
router.post("/", authMiddleware, createBooking);

export default router;
