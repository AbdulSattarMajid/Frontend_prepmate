import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { Shield, Users, CreditCard, DollarSign, TrendingDown, Wrench } from 'lucide-react'; // 🌟 Removed MoreHorizontal, we don't need it anymore

const BASE_URL =import.meta.env.VITE_AUTH_BASE_URL;

const AdminPage = ({ onNav }) => {
  const { token } = useApp();
  const [section, setSection] = useState('overview');
  const SECTIONS = ['overview','users','content','settings'];

  // 🌟 LIVE DATA STATES
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 FETCH REAL USERS FROM DATABASE
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success || Array.isArray(data)) {
          // Supports both { success: true, data: [...] } and raw arrays
          setUsersList(data.data || data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  // 🌟 NEW: DELETE USER FUNCTION
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${userName}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        // Remove the user from the UI instantly
        setUsersList(prev => prev.filter(u => u._id !== userId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to delete user due to a network error.");
    }
  };

  // Dynamically calculate stats based on the live database
  const proSubscribers = usersList.filter(u => u.plan === 'Pro' || u.plan === 'Elite').length;

  const ADMIN_STATS = [
    { label:'Total Users',     value: loading ? '-' : usersList.length.toString(), change:'Live', pos:true,  icon: <Users className="w-5 h-5 text-blue-500" /> },
    { label:'Pro Subscribers', value: loading ? '-' : proSubscribers.toString(),   change:'Live', pos:true,  icon: <CreditCard className="w-5 h-5 text-purple-500" /> },
    { label:'MRR',             value:'$0.00', change:'0%', pos:true,  icon: <DollarSign className="w-5 h-5 text-green-500" /> },
    { label:'Churn Rate',      value:'0%',    change:'0%', pos:false, icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
  ];

  return (
    <div className="p-5 md:p-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
        <div>
          {/* Removed the Back to Dashboard button since this IS the dashboard for Admins! */}
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
                  {loading ? (
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
                            {/* Uses actual Cloudinary Avatar if available */}
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
                          {/* 🌟 NEW: The Delete Button (Hidden for Admins) */}
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

      {section !== 'overview' && (
        <Card className="py-20 text-center">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="font-bold text-lg mb-2 capitalize">{section} Management</p>
          <p className="text-muted text-sm">This section is under construction.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminPage;