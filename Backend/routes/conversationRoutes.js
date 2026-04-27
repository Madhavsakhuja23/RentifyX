import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getConversations,
  getMessages,
  createConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.get("/:conversationId/messages", authMiddleware, getMessages);
router.post("/", authMiddleware, createConversation);

export default router;
