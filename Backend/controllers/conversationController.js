import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// GET /api/conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [{ sellerId: userId }, { buyerId: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("buyerId", "name photo")
      .populate("sellerId", "name photo")
      .populate("listingId", "title category images");

    res.json({ conversations });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/messages/:conversationId
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("senderId", "name photo");

    res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// POST /api/conversations
export const createConversation = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { listingId, sellerId } = req.body;

    let conversation = await Conversation.findOne({
      listingId,
      buyerId,
      sellerId,
    });

    if (!conversation) {
      conversation = new Conversation({
        listingId,
        buyerId,
        sellerId,
      });
      await conversation.save();
    }

    res.json({ conversation });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
