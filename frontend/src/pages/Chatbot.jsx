import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import FloatingCard from '../components/FloatingCard';
import api from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your safety assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Smooth scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overrideInput = null) => {
    const textToSend = overrideInput ?? input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: "user", parts: textToSend }];

    try {
      const response = await api.post('/ai/chat', {
        message: textToSend,
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

  const quickActions = [
    'Report an incident',
    'Find safe routes',
    'Emergency contacts',
    'Safety tips'
  ];

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
          
          {/* Header */}
          <FloatingCard className="mb-4 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Safety Assistant
                  <Sparkles className="w-4 h-4 text-primary" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
          </FloatingCard>

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 p-4 smooth-scroll"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 message-bubble ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'glass-card rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSend(action);
                    }}
                    className="px-3 py-2 text-xs rounded-full glass-panel hover:bg-white/10 transition-all duration-300"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="glass-panel rounded-2xl p-4 mt-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground max-h-32"
                rows="1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
