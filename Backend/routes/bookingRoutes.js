import express from "express";
import { checkAvailability, createBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/bookings/check-availability
router.post("/check-availability", checkAvailability);

// POST /api/bookings — requires authentication
router.post("/", authMiddleware, createBooking);

export default router;
