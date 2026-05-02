import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';

export default function FloatingChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m your safety assistant. How can I help you?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const chatRef = useRef(null);
  const buttonRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Animate button entrance
    gsap.fromTo(buttonRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 1 }
    );
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Animate chat window open
      gsap.fromTo(chatRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: "user", parts: userText }];

    try {
      const response = await api.post('/ai/chat', {
        message: userText,
        history: conversationHistory
      });

      const botReply = response.data.reply;
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botReply,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConversationHistory([...newHistory, { role: "model", parts: botReply }]);
      
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I'm unable to respond right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      // Remove the last user message from history on error since it wasn't successfully responded to,
      // or we can keep it. Keeping it might be fine, but we didn't add it to conversationHistory yet.
      // Wait, we didn't setConversationHistory(newHistory) before the try catch! So history is unaltered.
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <button
        ref={buttonRef}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        style={{ willChange: 'transform' }}
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        ref={buttonRef}
        onClick={toggleMinimize}
        className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition-transform duration-300"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium">Safety Assistant</span>
        <Maximize2 className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] glass-panel rounded-2xl shadow-2xl overflow-hidden"
      style={{ maxHeight: '600px', willChange: 'transform, opacity' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Safety Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/chat');
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              title="Open full page"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMinimize}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user'
                ? 'bg-primary'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {message.type === 'user' ? (
                <span className="text-xs text-white">You</span>
              ) : (
                <Bot className="w-3 h-3 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] p-3 rounded-xl ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-white/5 border border-white/10 rounded-tl-sm'
              }`}
            >
              <p className="text-xs leading-relaxed">{message.text}</p>
              <p className={`text-[10px] mt-1 ${
                message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors duration-200 placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
