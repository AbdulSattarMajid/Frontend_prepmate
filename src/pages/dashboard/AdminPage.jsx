import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { Shield, Users, CreditCard, DollarSign, TrendingDown, Wrench, Star, MessageSquare, Send, Radio, ShieldAlert, Mail, Inbox } from 'lucide-react';
import { io } from 'socket.io-client'; 

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000';

const AdminPage = ({ onNav }) => {
  const { token, user } = useApp(); 
  const [section, setSection] = useState('overview');
  
  // 🌟 ADDED 'inbox' to the tabs for the offline contact forms
  const SECTIONS = ['overview','users','reviews','support','inbox','settings'];

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Reviews State
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // 🌟 NEW: Contact Messages State (Footer Form)
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingContact, setLoadingContact] = useState(false);

  // Admin Live Chat State
  const [socket, setSocket] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch Real Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success || Array.isArray(data)) {
          setUsersList(data.data || data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Fetch All Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await fetch(`${BASE_URL}/api/reviews/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setReviewsList(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (token && section === 'reviews') fetchReviews();
  }, [token, section]);

  // 🌟 NEW: Fetch Contact/Support Form Messages
  useEffect(() => {
    const fetchContactMessages = async () => {
      setLoadingContact(true);
      try {
        // We pass the token just in case you secured the route with middleware
        const res = await fetch(`${BASE_URL}/api/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setContactMessages(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch contact messages", err);
      } finally {
        setLoadingContact(false);
      }
    };

    if (section === 'inbox') fetchContactMessages();
  }, [section, token]);

  // Initialize Admin Socket Connection
  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    newSocket.on('chat-history', (historyData) => {
      setChatMessages(historyData);
    });

    newSocket.on('receive-support-message', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${userName}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setUsersList(prev => prev.filter(u => u._id !== userId));
        if (activeChatUser?._id === userId) setActiveChatUser(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to delete user due to a network error.");
    }
  };

  const handleToggleFeature = async (reviewId, isCurrentlyFeatured) => {
    if (!isCurrentlyFeatured) {
      const currentFeaturedCount = reviewsList.filter(r => r.isFeatured).length;
      if (currentFeaturedCount >= 3) {
        alert("You can only feature 3 reviews on the landing page at a time. Please unfeature one first.");
        return;
      }
    }

    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/feature`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setReviewsList(prev => prev.map(r => r._id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r));
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      alert("Failed to feature review due to a network error.");
    }
  };

  const handleSelectChatUser = (student) => {
    setActiveChatUser(student);
    setChatMessages([]); 
    socket.emit('join-support-room', student._id); 
  };

  const handleAdminSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket || !activeChatUser) return;

    const messageData = {
      roomId: activeChatUser._id, 
      text: chatInput,
      senderId: user._id, 
      senderName: "PrepMate Admin",
      isAdmin: true
    };

    socket.emit('send-support-message', messageData);
    setChatInput('');
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastInput.trim() || !socket) return;
    
    if(!window.confirm("WARNING: This will instantly send a push notification message to EVERY active user on the platform. Proceed?")) return;

    socket.emit('admin-broadcast', {
      text: broadcastInput,
      senderName: "System Broadcast",
      isAdmin: true,
      timestamp: new Date().toISOString()
    });

    setBroadcastInput('');
    alert("Broadcast sent successfully!");
  };

  const proSubscribers = usersList.filter(u => u.plan === 'Pro' || u.plan === 'Elite').length;
  const featuredCount = reviewsList.filter(r => r.isFeatured).length;

  return (
    <div className="p-5 md:p-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Shield className="w-7 h-7 text-brand-lt" /> Admin Panel
          </h1>
          <p className="text-muted text-sm mt-1">Manage users, content, and platform settings.</p>
        </div>
        <Badge color="purple">Super Admin</Badge>
      </div>

      <div className="flex gap-1 bg-card2 border border-bdr2 rounded-xl p-1 w-fit mb-8 overflow-x-auto">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sora capitalize border-0 transition-all whitespace-nowrap ${section===s ? 'bg-brand text-white' : 'bg-transparent text-muted hover:text-txt'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* OVERVIEW SECTION */}
      {section === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {ADMIN_STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          <Card>
            <div className="flex justify-between items-center mb-5">
              <p className="font-bold">Registered Users</p>
              <Badge color="blue">{usersList.length} total</Badge>
            </div>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-bdr">
                    {['User','Plan','Status','Joined','Action'].map(h => (
                      <th key={h} className="text-left text-[11px] text-ghost tracking-widest py-2.5 px-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-muted animate-pulse">Loading live users...</td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-muted">No users found in database.</td>
                    </tr>
                  ) : (
                    usersList.map(u => (
                      <tr key={u._id} className="border-b border-bdr/50 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-bdr" />
                            ) : (
                              <Avatar name={u.name} size={32} />
                            )}
                            <div>
                              <p className="font-semibold text-sm flex items-center gap-2">
                                {u.name} {u.role === 'admin' && <Badge color="purple" size="sm">Admin</Badge>}
                              </p>
                              <p className="text-xs text-ghost">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3"><Badge color={u.plan==='Elite'?'purple':u.plan==='Pro'?'blue':'ghost'}>{u.plan || 'Free'}</Badge></td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-500" />
                            Active
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-ghost">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3">
                          {u.role !== 'admin' ? (
                            <button 
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="bg-transparent border-0 text-red-400 hover:text-red-300 font-bold text-xs uppercase cursor-pointer transition-colors"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-[10px] text-ghost uppercase font-bold tracking-widest">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* REVIEWS SECTION */}
      {section === 'reviews' && (
        <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand" /> User Feedback
              </h2>
              <p className="text-sm text-muted mt-1">Select exactly 3 reviews to feature on the public landing page.</p>
            </div>
            <Badge color={featuredCount === 3 ? 'green' : 'orange'}>
              {featuredCount}/3 Featured
            </Badge>
          </div>

          {loadingReviews ? (
            <Card className="py-20 text-center animate-pulse">
              <p className="text-muted">Loading user reviews...</p>
            </Card>
          ) : reviewsList.length === 0 ? (
            <Card className="py-20 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-bdr2" />
              <p className="font-bold text-lg mb-2">No reviews yet</p>
              <p className="text-muted text-sm">When users submit feedback from Settings, it will appear here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reviewsList.map(review => (
                <Card 
                  key={review._id} 
                  className={`p-6 transition-all border-2 ${review.isFeatured ? 'border-brand bg-brand/5' : 'border-bdr'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {review.userId?.avatarUrl ? (
                        <img src={review.userId.avatarUrl} alt="User" className="w-10 h-10 rounded-full object-cover border border-bdr" />
                      ) : (
                        <Avatar name={review.userId?.name || 'User'} size={40} />
                      )}
                      <div>
                        <p className="font-semibold text-sm">{review.userId?.name || 'Unknown User'}</p>
                        <div className="flex gap-1 text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-bdr2'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleFeature(review._id, review.isFeatured)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        review.isFeatured 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                          : 'bg-card2 text-txt border-bdr hover:border-brand'
                      }`}
                    >
                      {review.isFeatured ? 'Remove from Wall' : 'Feature on Wall'}
                    </button>
                  </div>
                  
                  <div className="bg-card2 rounded-lg p-4 text-sm text-muted italic border border-bdr2">
                    {review.feedback ? `"${review.feedback}"` : "No text feedback provided."}
                  </div>
                  
                  <p className="text-xs text-ghost mt-4 text-right">
                    Submitted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIVE SUPPORT / CHAT COMMAND CENTER */}
      {section === 'support' && (
        <div className="animate-fade-in-up h-[700px] flex flex-col gap-4">
          
          <Card className="p-4 flex gap-4 items-center bg-red-500/5 border-red-500/20 shrink-0">
            <Radio className="w-6 h-6 text-red-500" />
            <form onSubmit={handleBroadcast} className="flex-1 flex gap-2">
              <input 
                type="text" 
                placeholder="Global Broadcast: Send an alert to all active users..."
                value={broadcastInput}
                onChange={(e) => setBroadcastInput(e.target.value)}
                className="flex-1 bg-card border border-bdr rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none"
              />
              <button 
                type="submit" 
                disabled={!broadcastInput.trim()}
                className="px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                Broadcast
              </button>
            </form>
          </Card>

          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
            <div className="w-full md:w-1/3 bg-card border border-bdr rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-bdr bg-card2 shrink-0">
                <h3 className="font-bold text-sm">Inbox (Select User)</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {usersList.filter(u => u._id !== user._id).map(student => (
                  <button
                    key={student._id}
                    onClick={() => handleSelectChatUser(student)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors border ${
                      activeChatUser?._id === student._id 
                        ? 'bg-brand/10 border-brand/30' 
                        : 'bg-transparent border-transparent hover:bg-card2 hover:border-bdr2'
                    }`}
                  >
                    {student.avatarUrl ? (
                      <img src={student.avatarUrl} alt="User" className="w-10 h-10 rounded-full object-cover border border-bdr shrink-0" />
                    ) : (
                      <Avatar name={student.name} size={40} />
                    )}
                    <div className="overflow-hidden">
                      <p className={`font-semibold text-sm truncate ${activeChatUser?._id === student._id ? 'text-brand-lt' : 'text-txt'}`}>
                        {student.name}
                      </p>
                      <p className="text-xs text-muted truncate">{student.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-2/3 bg-card2 border border-bdr rounded-xl flex flex-col overflow-hidden">
              {activeChatUser ? (
                <>
                  <div className="bg-card border-b border-bdr p-4 flex items-center gap-3 shrink-0">
                    <Avatar name={activeChatUser.name} size={32} />
                    <div>
                      <h3 className="font-bold text-txt text-sm">Chatting with {activeChatUser.name}</h3>
                      <p className="text-xs text-muted">ID: {activeChatUser._id}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm">No message history yet.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={msg._id || idx} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                              msg.isAdmin 
                                ? 'bg-brand text-white rounded-tr-sm' 
                                : 'bg-card border border-bdr text-txt rounded-tl-sm' 
                            }`}
                          >
                            {msg.text}
                          </div>
                          {msg.createdAt && (
                            <span className="text-[9px] text-muted mt-1 px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleAdminSend} className="p-3 bg-card border-t border-bdr flex gap-2 shrink-0">
                    <input 
                      type="text"
                      placeholder={`Reply to ${activeChatUser.name}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-card2 border border-bdr2 rounded-lg px-4 py-2.5 text-txt text-sm focus:outline-none focus:border-brand"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="px-4 bg-brand hover:bg-brand-lt text-white rounded-lg flex items-center justify-center disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                  <p>Select a user from the inbox to view chat history and reply.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* 🌟 NEW: INBOX SECTION (For Footer Contact Form) */}
      {section === 'inbox' && (
        <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Inbox className="w-5 h-5 text-brand" /> Offline Inquiries
              </h2>
              <p className="text-sm text-muted mt-1">Support messages sent from the public footer form.</p>
            </div>
            <Badge color="blue">{contactMessages.length} Messages</Badge>
          </div>

          {loadingContact ? (
            <Card className="py-20 text-center animate-pulse">
              <p className="text-muted">Loading messages...</p>
            </Card>
          ) : contactMessages.length === 0 ? (
            <Card className="py-20 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-bdr2" />
              <p className="font-bold text-lg mb-2">Inbox Empty</p>
              <p className="text-muted text-sm">No contact messages have been submitted yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {contactMessages.map(msg => (
                <Card key={msg._id} className="p-5 flex flex-col md:flex-row gap-4 border border-bdr hover:border-bdr2 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-txt">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-xs text-brand-lt hover:underline">{msg.email}</a>
                      </div>
                      <span className="text-xs text-ghost font-mono">
                        {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="bg-card2 p-4 rounded-lg text-sm text-muted border border-bdr2 whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fallback for Settings */}
      {section === 'settings' && (
        <Card className="py-20 text-center animate-fade-in-up">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="font-bold text-lg mb-2 capitalize">{section} Management</p>
          <p className="text-muted text-sm">This section is under construction.</p>
        </Card>
      )}
    </div>
  );
};

// Extracted STATS out to prevent reference errors from earlier code omission
const ADMIN_STATS = [
  { label:'Total Users',     value: '-', change:'Live', pos:true,  icon: <Users className="w-5 h-5 text-blue-500" /> },
  { label:'Pro Subscribers', value: '-', change:'Live', pos:true,  icon: <CreditCard className="w-5 h-5 text-purple-500" /> },
  { label:'MRR',             value:'$0.00', change:'0%', pos:true,  icon: <DollarSign className="w-5 h-5 text-green-500" /> },
  { label:'Churn Rate',      value:'0%',    change:'0%', pos:false, icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
];

export default AdminPage;