import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { createChatSession, analyzeSentiment, speakText } from '../services/geminiService';
import { ChatMessage, EmotionalStatus } from '../types';
import { Send, User, Bot, Loader2, Sparkles, Brain, Volume2 } from 'lucide-react';

export const Chat: React.FC = () => {
  const { user, setEmotionalStatus } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello ${user.name}. I'm here to listen. How are you feeling today?`,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    chatSessionRef.current = createChatSession(useThinking);
    // Optional: Add a system message indicating mode switch if it's not the initial load
    // but for simplicity we just silently switch the session for next messages
  }, [useThinking]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // 1. Get Chat Response
      const result = await chatSessionRef.current.sendMessage(userText);
      const responseText = result.response.text();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        isThinking: useThinking
      };
      
      setMessages(prev => [...prev, botMessage]);

      // 2. Background Sentiment Analysis (Non-blocking)
      analyzeSentiment(userText).then(status => {
        if (status !== EmotionalStatus.Unknown) {
            setEmotionalStatus(status);
        }
      });

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please check your internet or try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  const toggleThinking = () => {
    if (messages.length > 1) {
      if (!window.confirm("Switching modes will start a new conversation context. Continue?")) {
        return;
      }
      setMessages([{
        id: 'welcome-reset',
        role: 'model',
        text: `I've switched to ${!useThinking ? 'Deep Thinking' : 'Standard'} mode. How can I help?`,
        timestamp: Date.now()
      }]);
    }
    setUseThinking(!useThinking);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">HopeConnect AI</h2>
                    <p className="text-xs text-slate-500">Always here for you</p>
                </div>
            </div>
            
            <button 
              onClick={toggleThinking}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                useThinking 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{useThinking ? 'Thinking Mode On' : 'Thinking Mode Off'}</span>
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {msg.role === 'model' && (
                         <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 flex-shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                    )}
                    <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed relative group ${
                            msg.role === 'user' 
                            ? 'bg-teal-600 text-white rounded-br-none' 
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}
                    >
                        {msg.text}
                        {msg.role === 'model' && (
                          <button 
                            onClick={() => handleSpeak(msg.text)}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-slate-200 hover:bg-teal-100 text-slate-600 hover:text-teal-600 transition-all"
                            title="Read aloud"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                     {msg.role === 'user' && (
                         <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        {useThinking && <span className="text-xs text-purple-500 font-medium">Thinking...</span>}
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex space-x-2">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
};