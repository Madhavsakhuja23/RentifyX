import express from "express";
import { signupUser, loginUser, googleAuth, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Protected routes (require valid JWT)
router.get("/me", authMiddleware, getMe);

export default router;




