import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import api from "../../api";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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

    const socketInstance = io("http://localhost:5000", {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketInstance.on("new_message_notification", (message) => {
      // Fetch exact count to reflect unique conversations
      fetchUnreadCount();
      
      // Check if we are not actively on the messages page for this conversation
      // We rely on the local page to emit 'mark_read' if active, which triggers 'messages_read_by_me'
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
  }, [fetchUnreadCount]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, fetchUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};
