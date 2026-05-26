import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { FaComments } from "react-icons/fa";


function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        // Lock body scroll and prevent layout shift from scrollbar disappearing
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.classList.add("chatbot-blur");
        document.body.style.overflow = "hidden";
        if (scrollBarWidth > 0) {
          document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
      } else {
        // Unlock body scroll
        document.body.classList.remove("chatbot-blur");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
      return next;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("chatbot-blur");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome! I can help you find accommodations 🏡 or vehicle rentals 🚗. What are you looking for today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Bot Responses ---------- */

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // ---- Greetings ----
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hi there! 👋 I can help you find villas, flats, PGs, hostels, travel stays, or even rent vehicles 🚗. What are you looking for?";
    }

    // ---- Property Types ----
    if (msg.includes("villa") || msg.includes("luxury stay")) {
      return "We offer beautiful villas perfect for vacations or luxury stays. You can browse available villas in the Villas section.";
    }

    if (msg.includes("flat") || msg.includes("apartment")) {
      return "You can explore fully furnished flats and apartments ideal for long or short stays in the Flats section.";
    }

    if (msg.includes("pg") || msg.includes("paying guest")) {
      return "Looking for PG accommodation? We list verified PGs with amenities like WiFi, meals, and security.";
    }

    if (msg.includes("hostel")) {
      return "Our hostels are budget-friendly and perfect for students and travelers.";
    }

    if (msg.includes("travel") || msg.includes("vacation") || msg.includes("holiday")) {
      return "Planning a trip? 🌍 Our travel stays include vacation homes, villas, and unique places to stay.";
    }

    // ---- Vehicle Rentals / Driveables ----
    if (
      msg.includes("car") ||
      msg.includes("bike") ||
      msg.includes("scooter") ||
      msg.includes("vehicle") ||
      msg.includes("drive") ||
      msg.includes("driveable") ||
      msg.includes("rent vehicle")
    ) {
      return "🚗 We also offer vehicle rentals! You can rent cars, bikes, and scooters for travel and local commuting. Just visit the Driveables section to explore available vehicles.";
    }

    // ---- Booking ----
    if (msg.includes("book") || msg.includes("booking")) {
      return "To book a property, open the listing, select your dates, and click 'Reserve Now'. You will see the total price before confirming.";
    }

    // ---- Price ----
    if (msg.includes("price") || msg.includes("cost") || msg.includes("rent")) {
      return "Prices vary depending on the property or vehicle type, location, and dates. You can view exact prices on each listing page.";
    }

    // ---- Availability ----
    if (msg.includes("available") || msg.includes("availability")) {
      return "You can check availability by selecting your check-in and check-out dates on the listing page.";
    }

    // ---- Payment ----
    if (msg.includes("payment") || msg.includes("pay") || msg.includes("transaction")) {
      return "We support UPI, Debit/Credit Cards, Net Banking, and international payments for booking stays or renting vehicles.";
    }

    // ---- Cancellation ----
    if (msg.includes("cancel") || msg.includes("refund")) {
      return "Cancellation policies depend on the property or vehicle. Most listings offer free cancellation within a specific time window.";
    }

    // ---- Amenities ----
    if (msg.includes("amenities") || msg.includes("wifi") || msg.includes("parking")) {
      return "Most properties offer amenities like WiFi, parking, air conditioning, kitchen access, and more. Check the amenities section on the listing.";
    }

    // ---- Location ----
    if (msg.includes("location") || msg.includes("where")) {
      return "You can view the exact property location on the map available in each listing page.";
    }

    // ---- Contact ----
    if (msg.includes("contact") || msg.includes("support") || msg.includes("help")) {
      return "You can contact our support team anytime through the Contact Us page or email support@rentifyx.com.";
    }

    // ---- Default ----
    return "I'm here to help with rentals 🏠🚗 You can ask about villas, flats, PGs, hostels, travel stays, vehicle rentals, booking, payment, or cancellations.";
  };

  /* ---------- Quick Buttons ---------- */

  const quickAsk = (question) => {
    const newMessages = [
      ...messages,
      { sender: "user", text: question },
      { sender: "bot", text: getBotResponse(question) },
    ];

    setMessages(newMessages);
  };

  /* ---------- Send Message ---------- */

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: getBotResponse(userMsg.text),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <FaComments />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop — closes chat on tap */}
          <div className="chatbot-backdrop" onClick={toggleChat} />

          <div className="chatbot-overlay">

            <div className="chatbot-header">
              <h3>Rental Assistant 🏡</h3>
              <button onClick={toggleChat}>×</button>
            </div>

            {/* Quick Questions */}
            <div className="chatbot-quick">
              <button onClick={() => quickAsk("Show villas")}>🏡 Villas</button>
              <button onClick={() => quickAsk("Available flats")}>🏢 Flats</button>
              <button onClick={() => quickAsk("PG accommodation")}>🛏 PG</button>
              <button onClick={() => quickAsk("Vehicle rental")}>🚗 Driveables</button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chatbot-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="chatbot-message bot typing">
                  Typing...
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask about rentals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button onClick={handleSend}>Send</button>
            </div>

          </div>
        </>
      )}
    </>
  );
}

export default Chatbot;