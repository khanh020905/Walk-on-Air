import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg = { id: Date.now(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userText }),
        }
      );

      if (response.ok) {
        let data = await response.text();

        // Handle specific Google API overload/errors that come through as text
        if (
          data.includes("503 Service Unavailable") ||
          data.includes("Model is overloaded")
        ) {
          data =
            "I'm currently experiencing high traffic. Please try asking again in a moment.";
        } else if (data.includes("Sorry, I am having trouble connecting")) {
          data = "I'm having temporary trouble connecting. Please try again.";
        }

        const botMsg = {
          id: Date.now() + 1,
          text: data,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
        console.log(messages);
      } else {
        const botMsg = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting to the server.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const botMsg = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div
        ref={chatRef}
        className={`

                    mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 md:w-96 
                    overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto
                    ${
                      isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                    }
                `}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Customer Support</h3>
              <p className="text-xs text-blue-100 opacity-90">
                Usually replies in minutes
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-96 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-700 border border-gray-100 self-start rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white text-gray-700 border border-gray-100 self-start rounded-bl-none shadow-sm max-w-[80%] p-3 rounded-2xl text-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-gray-100 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={toggleChat}
        className={`
                    pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full 
                    shadow-lg hover:shadow-xl transition-all duration-300 transform
                    ${
                      isOpen
                        ? "rotate-90 opacity-0 pointer-events-none"
                        : "rotate-0 opacity-100"
                    }
                `}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default ChatBot;
