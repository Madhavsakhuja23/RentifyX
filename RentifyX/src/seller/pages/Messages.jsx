import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../../api';
import { Search, Send, User, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './Messages.css';

export default function Messages() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv._id);
      socket?.emit('join_conversation', selectedConv._id);
      socket?.emit('mark_read', selectedConv._id);
    }
  }, [selectedConv, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message) => {
      if (selectedConv && message.conversationId === selectedConv._id) {
        setMessages((prev) => [...prev, message]);
        socket.emit('mark_read', selectedConv._id);
      }
      // Update conversations list with last message
      setConversations((prev) => 
        prev.map(c => c._id === message.conversationId ? { ...c, lastMessage: message.text, updatedAt: new Date() } : c)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    });

    socket.on('typing_indicator', ({ conversationId }) => {
      if (selectedConv && conversationId === selectedConv._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on('messages_read', ({ conversationId }) => {
       if (selectedConv && conversationId === selectedConv._id) {
         setMessages(prev => prev.map(m => ({ ...m, read: true })));
       }
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing_indicator');
      socket.off('messages_read');
    };
  }, [socket, selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.conversations || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await api.get(`/conversations/${id}/messages`);
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !socket || !user) return;

    const receiverId = selectedConv.sellerId?._id === user.id ? selectedConv.buyerId?._id : selectedConv.sellerId?._id;

    const messageData = {
      conversationId: selectedConv._id,
      text: newMessage,
      senderId: user.id,
      receiverId,
      listingId: selectedConv.listingId?._id,
    };

    socket.emit('send_message', messageData);
    // Optimistically add the message to the UI
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date().toISOString(), read: false }]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (selectedConv && socket) {
      socket.emit('typing', selectedConv._id);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Sidebar */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h3>Inbox</h3>
            <div className="search-messages">
              <Search size={18} />
              <input type="text" placeholder="Search chats..." />
            </div>
          </div>
          <div className="conversations-list">
            {loading ? (
              <div className="loading-state">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">No conversations yet</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`conversation-item ${selectedConv?._id === conv._id ? 'active' : ''}`}
                  onClick={() => setSelectedConv(conv)}
                >
                  <div className="conv-avatar">
                    {conv.listingId?.images?.[0]?.url ? (
                      <img src={conv.listingId.images[0].url} alt="Listing" />
                    ) : (
                      <div className="avatar-placeholder"><User size={20} /></div>
                    )}
                  </div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">
                        {conv.sellerId._id === user.id ? conv.buyerId.name : conv.sellerId.name}
                      </span>
                      <span className="conv-time">
                        {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: false })}
                      </span>
                    </div>
                    <div className="conv-listing">{conv.listingId?.title}</div>
                    <div className="conv-last-msg">
                      {conv.lastMessage || 'Start a conversation'}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && selectedConv?._id !== conv._id && (
                    <div className="unread-badge">{conv.unreadCount}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConv ? (
            <>
              <div className="chat-header">
                <div className="header-info">
                  <h4>{selectedConv.sellerId._id === user.id ? selectedConv.buyerId.name : selectedConv.sellerId.name}</h4>
                  <p>{selectedConv.listingId?.title}</p>
                </div>
              </div>
              <div className="messages-list">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`message-bubble ${m.senderId === user.id || m.senderId._id === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-text">{m.text}</div>
                    <div className="message-meta">
                      {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                      {m.senderId === user.id && (
                        <span className="read-status">{m.read ? ' · Seen' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message-bubble received typing">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="message-input-area" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageCircle size={64} />
              <h3>Your Messages</h3>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
