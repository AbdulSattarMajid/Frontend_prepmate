import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Star, Loader2, Check, MessageSquare, Send, ShieldAlert } from 'lucide-react';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const SupportTab = () => {
  const { token, user } = useApp();
  
  // Review State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle');

  // Live Chat State
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Socket & Load Database History
  useEffect(() => {
    if (!user?._id) return; // Prevent connecting if user isn't fully loaded

    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-support-room', user._id);
    });

    // 🌟 NEW: Load the historical messages from MongoDB when we join
    newSocket.on('chat-history', (historyData) => {
      if (historyData.length === 0) {
        // If it's a brand new user, show a fake welcome message
        setMessages([{ 
          _id: 'welcome', 
          text: 'Hello! How can we help you with PrepMate today?', 
          senderName: 'System', 
          isAdmin: true 
        }]);
      } else {
        setMessages(historyData);
      }
    });

    // Receive new live messages
    newSocket.on('receive-support-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Receive Admin Broadcasts
    newSocket.on('receive-broadcast', (data) => {
      setMessages((prev) => [...prev, { ...data, isBroadcast: true }]);
    });

    return () => newSocket.disconnect();
  }, [user?._id]);

  const handleReviewSubmit = async () => {
    if (!rating) {
      alert("Please select a star rating first.");
      return;
    }

    setReviewStatus('submitting');
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, feedback: reviewText })
      });
      const result = await res.json();
      if (res.ok) {
        setReviewStatus('success');
        setRating(0);
        setReviewText('');
        setTimeout(() => setReviewStatus('idle'), 4000);
      } else {
        alert(result.message || "Failed to submit review.");
        setReviewStatus('idle');
      }
    } catch (error) {
      alert("A network error occurred.");
      setReviewStatus('idle');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    const messageData = {
      roomId: user._id, 
      text: inputText,
      senderId: user._id,
      senderName: user.name,
      isAdmin: false
    };

    // Send it to the server (The server saves to DB, then bounces it back to us)
    socket.emit('send-support-message', messageData);
    setInputText('');
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* 1. THE REVIEW SYSTEM */}
      <div>
        <h2 className="text-xl font-bold text-txt mb-2 transition-colors">Platform Feedback</h2>
        <p className="text-sm text-muted mb-6 transition-colors">Rate your experience and let us know how we can improve.</p>
        
        <div className="bg-card2 border border-bdr rounded-xl p-6 transition-colors text-center">
          <h3 className="text-lg font-bold text-txt mb-4 transition-colors">How is your PrepMate experience?</h3>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={36} 
                  className={`${
                    star <= (hoverRating || rating) ? 'fill-brand text-brand' : 'text-bdr2'
                  } transition-colors duration-200`} 
                />
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            placeholder="Tell us what you love or what we could do better... (Optional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full bg-card border border-bdr rounded-lg px-4 py-3 text-txt text-sm focus:outline-none focus:border-brand transition-colors resize-none mb-4"
          />

          <button 
            onClick={handleReviewSubmit}
            disabled={reviewStatus === 'submitting' || rating === 0}
            className="w-full sm:w-auto px-8 py-2.5 bg-brand hover:bg-brand-lt text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {reviewStatus === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : 'Submit Review'}
          </button>

          {reviewStatus === 'success' && (
            <p className="text-green-500 text-sm font-semibold mt-4 animate-fade-in-up flex items-center justify-center gap-1">
              <Check size={16} /> Thank you for your feedback!
            </p>
          )}
        </div>
      </div>

      <hr className="border-bdr" />

      {/* 2. THE LIVE CHAT SYSTEM */}
      <div>
        <h2 className="text-xl font-bold text-txt mb-2 transition-colors">Live Support</h2>
        <p className="text-sm text-muted mb-6 transition-colors">Need technical help? Chat directly with an admin below.</p>
        
        <div className="bg-card2 border border-bdr rounded-xl flex flex-col h-[400px] overflow-hidden transition-colors">
          
          {/* Chat Header */}
          <div className="bg-card border-b border-bdr p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand-lt">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="font-bold text-txt text-sm">Support Team</h3>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-card/50">
            {messages.map((msg, idx) => (
              <div 
                key={msg._id || idx} 
                className={`flex flex-col ${msg.isAdmin || msg.isBroadcast ? 'items-start' : 'items-end'}`}
              >
                {msg.isBroadcast && (
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                    <ShieldAlert size={12} /> Admin Broadcast
                  </span>
                )}
                <div 
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.isBroadcast 
                      ? 'bg-red-500/10 border border-red-500/20 text-red-500' 
                      : msg.isAdmin 
                        ? 'bg-card border border-bdr text-txt rounded-tl-sm'  
                        : 'bg-brand text-white rounded-tr-sm'                  
                  }`}
                >
                  {msg.text}
                </div>
                {/* Tiny timestamp under the message */}
                {msg.createdAt && (
                  <span className="text-[9px] text-muted mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-bdr flex gap-2">
            <input 
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-card2 border border-bdr2 rounded-lg px-4 py-2.5 text-txt text-sm focus:outline-none focus:border-brand transition-colors"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 bg-brand hover:bg-brand-lt text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SupportTab;