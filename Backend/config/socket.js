import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id: ... }
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} (User ID: ${socket.user.id})`);

    // Join a personal room for global notifications
    socket.join(socket.user.id);

    // Join a conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      const { conversationId, text, senderId, receiverId, listingId } = data;
      try {
        // Save to Message collection
        const message = new Message({
          conversationId,
          senderId,
          receiverId,
          listingId,
          text,
        });
        await message.save();

        // Update Conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          $inc: { unreadCount: 1 },
          updatedAt: new Date(),
        });

        // Emit to room
        io.to(conversationId).emit("receive_message", message);
        
        // Emit global notification to receiver
        io.to(receiverId).emit("new_message_notification", message);
      } catch (err) {
        console.error("Error saving message via socket:", err);
      }
    });

    // Mark messages as read
    socket.on("mark_read", async (conversationId) => {
      try {
        // Mark all messages in this conversation where the current user is the receiver as read
        await Message.updateMany(
          { conversationId, receiverId: socket.user.id, read: false },
          { $set: { read: true } }
        );

        // Reset unread count on conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          unreadCount: 0,
        });

        // Broadcast to room that messages were read
        io.to(conversationId).emit("messages_read", { conversationId });
        
        // Notify the current user to update their global unread count
        io.to(socket.user.id).emit("messages_read_by_me", { conversationId });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    });

    // Handle typing indicator
    socket.on("typing", (conversationId) => {
      // Broadcast to others in room
      socket.to(conversationId).emit("typing_indicator", {
        conversationId,
        userId: socket.user.id,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
