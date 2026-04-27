import express from "express";
import { checkAvailability, createBooking, getMyBookings } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/bookings — requires authentication
router.get("/", authMiddleware, getMyBookings);

// POST /api/bookings/check-availability
router.post("/check-availability", checkAvailability);

// POST /api/bookings — requires authentication
router.post("/", authMiddleware, createBooking);

export default router;
