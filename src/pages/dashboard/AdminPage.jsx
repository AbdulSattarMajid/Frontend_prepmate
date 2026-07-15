import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { Shield, Users, CreditCard, DollarSign, TrendingDown, Wrench, Star, MessageSquare } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const AdminPage = ({ onNav }) => {
  const { token } = useApp();
  const [section, setSection] = useState('overview');
  // 🌟 REPLACED 'content' with 'reviews'
  const SECTIONS = ['overview','users','reviews','settings'];

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // 🌟 Reviews State
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  // 🌟 Fetch All Reviews when the tab is clicked
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
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to delete user due to a network error.");
    }
  };

  // 🌟 Toggle Featured Status function
  const handleToggleFeature = async (reviewId, isCurrentlyFeatured) => {
    // Safety check before sending request
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
        // Instantly update the UI without reloading
        setReviewsList(prev => prev.map(r => r._id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r));
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      alert("Failed to feature review due to a network error.");
    }
  };

  const proSubscribers = usersList.filter(u => u.plan === 'Pro' || u.plan === 'Elite').length;
  const featuredCount = reviewsList.filter(r => r.isFeatured).length;

  const ADMIN_STATS = [
    { label:'Total Users',     value: loadingUsers ? '-' : usersList.length.toString(), change:'Live', pos:true,  icon: <Users className="w-5 h-5 text-blue-500" /> },
    { label:'Pro Subscribers', value: loadingUsers ? '-' : proSubscribers.toString(),   change:'Live', pos:true,  icon: <CreditCard className="w-5 h-5 text-purple-500" /> },
    { label:'MRR',             value:'$0.00', change:'0%', pos:true,  icon: <DollarSign className="w-5 h-5 text-green-500" /> },
    { label:'Churn Rate',      value:'0%',    change:'0%', pos:false, icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
  ];

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

      <div className="flex gap-1 bg-card2 border border-bdr2 rounded-xl p-1 w-fit mb-8">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sora capitalize border-0 transition-all ${section===s ? 'bg-brand text-white' : 'bg-transparent text-muted hover:text-txt'}`}>
            {s}
          </button>
        ))}
      </div>

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

      {/* 🌟 NEW REVIEWS SECTION */}
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

      {/* Fallback for other unfinished sections */}
      {(section === 'users' || section === 'settings') && (
        <Card className="py-20 text-center animate-fade-in-up">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="font-bold text-lg mb-2 capitalize">{section} Management</p>
          <p className="text-muted text-sm">This section is under construction.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminPage;