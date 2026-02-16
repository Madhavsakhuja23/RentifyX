import { useState } from 'react';
import { Send, Search } from 'lucide-react';

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(0);
    const [newMessage, setNewMessage] = useState('');

    const conversations = [
        {
            id: 1,
            name: 'John Smith',
            avatar: 'JS',
            lastMessage: 'Is the apartment available for next weekend?',
            time: '2 min ago',
            unread: 2
        },
        {
            id: 2,
            name: 'Sarah Williams',
            avatar: 'SW',
            lastMessage: 'Thank you for the quick response!',
            time: '1 hour ago',
            unread: 0
        },
        {
            id: 3,
            name: 'Mike Johnson',
            avatar: 'MJ',
            lastMessage: 'Can I book the Honda City for 3 days?',
            time: '3 hours ago',
            unread: 1
        },
        {
            id: 4,
            name: 'Emily Davis',
            avatar: 'ED',
            lastMessage: 'The beach house was amazing!',
            time: '1 day ago',
            unread: 0
        },
        {
            id: 5,
            name: 'Robert Brown',
            avatar: 'RB',
            lastMessage: 'Do you offer weekly discounts?',
            time: '2 days ago',
            unread: 0
        },
    ];

    const chatMessages = [
        {
            id: 1,
            sender: 'them',
            message: 'Hi! I am interested in your Ocean View Apartment listing.',
            time: '10:30 AM'
        },
        {
            id: 2,
            sender: 'me',
            message: 'Hello! Thank you for your interest. The apartment is currently available. What dates are you looking at?',
            time: '10:32 AM'
        },
        {
            id: 3,
            sender: 'them',
            message: 'I was thinking about next weekend, from Friday to Sunday.',
            time: '10:35 AM'
        },
        {
            id: 4,
            sender: 'me',
            message: 'Those dates work perfectly! The rate for the weekend is $250/night. The apartment has all amenities including WiFi, AC, and a fully equipped kitchen.',
            time: '10:38 AM'
        },
        {
            id: 5,
            sender: 'them',
            message: 'That sounds great! Is parking included?',
            time: '10:40 AM'
        },
        {
            id: 6,
            sender: 'me',
            message: 'Yes, free parking is included. You will have one dedicated parking spot.',
            time: '10:42 AM'
        },
        {
            id: 7,
            sender: 'them',
            message: 'Is the apartment available for next weekend?',
            time: '10:45 AM'
        },
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            // Handle sending message
            setNewMessage('');
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="seller-page-header">
                <h1>Messages</h1>
                <p>Communicate with your clients</p>
            </div>

            <div className="seller-messages-container">
                {/* Conversations List */}
                <div className="seller-conversations-list">
                    <div className="seller-conversations-header">
                        <h3>Conversations</h3>
                        <div style={{ position: 'relative', marginTop: '12px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {conversations.map((convo, index) => (
                            <div
                                key={convo.id}
                                className={`seller-conversation-item ${selectedChat === index ? 'active' : ''}`}
                                onClick={() => setSelectedChat(index)}
                            >
                                <div className="seller-conversation-avatar">
                                    {convo.avatar}
                                </div>
                                <div className="seller-conversation-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="seller-conversation-name">{convo.name}</div>
                                        <span className="seller-conversation-time">{convo.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="seller-conversation-preview">{convo.lastMessage}</div>
                                        {convo.unread > 0 && (
                                            <span style={{
                                                background: '#007FFF',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontWeight: '600'
                                            }}>
                                                {convo.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="seller-chat-area">
                    <div className="seller-chat-header">
                        <div className="seller-conversation-avatar">
                            {conversations[selectedChat]?.avatar}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', color: '#1a1a2e' }}>
                                {conversations[selectedChat]?.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#10B981' }}>Online</div>
                        </div>
                    </div>

                    <div className="seller-chat-messages">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`seller-message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                {msg.message}
                                <div className="seller-message-time">{msg.time}</div>
                            </div>
                        ))}
                    </div>

                    <form className="seller-chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messages;
