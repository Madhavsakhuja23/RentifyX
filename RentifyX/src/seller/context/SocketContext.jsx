import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import api from "../../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const activeConversationIdRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/conversations/unread-count');
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming token is stored here
    if (!token) return;

    fetchUnreadCount();

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socketInstance = io(socketUrl, {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketInstance.on("new_message_notification", (message) => {
      // 1. Skip if message is from myself
      const senderId = message.senderId?._id || message.senderId;
      const currentUserId = userRef.current?.id || userRef.current?._id;
      if (senderId && currentUserId && senderId === currentUserId) {
        return;
      }

      // 2. Skip if this conversation is currently open and active
      if (activeConversationIdRef.current === message.conversationId) {
        return;
      }

      // Fetch exact count to reflect unique conversations
      fetchUnreadCount();
      
      // Toast notification for incoming messages from other users
      toast.success(`New message received`, {
        icon: '💬',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    });

    socketInstance.on("messages_read_by_me", () => {
      // Refresh unread count to get accurate number since multiple messages could be read at once
      fetchUnreadCount();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [fetchUnreadCount, user]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, fetchUnreadCount, activeConversationId, setActiveConversationId }}>
      {children}
    </SocketContext.Provider>
  );
};
