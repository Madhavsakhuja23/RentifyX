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

    // Enhance conversations with the number of unread messages for the current user
    const enhancedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const unreadForMe = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: userId,
          read: false,
        });
        
        return {
          ...conv.toObject(),
          unreadForMe
        };
      })
    );

    res.json({ conversations: enhancedConversations });
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

// GET /api/messages/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Count distinct conversations that have unread messages for the user
    const unreadConvs = await Message.distinct("conversationId", {
      receiverId: userId,
      read: false
    });
    res.json({ unreadCount: unreadConvs.length });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// POST /api/conversations
export const createConversation = async (req, res) => {
  try {
    const buyerId = req.user.id;
    let { listingId, sellerId } = req.body;

    // If sellerId is missing from frontend, dynamically fetch it from the listing
    if (!sellerId) {
      const Listing = mongoose.model("Listing");
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ msg: "Listing not found" });
      }
      sellerId = listing.seller;
    }
    
    console.log("createConversation processing:", { listingId, sellerId, buyerId });

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
