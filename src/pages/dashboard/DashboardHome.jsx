import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { 
  Hand, 
  Brain, 
  Play, 
  Trophy, 
  MessageSquare, 
  Bookmark, 
  TrendingUp, 
  FileText 
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

// 🌟 THE ADMIN DASHBOARD VIEW
const AdminDashboardView = ({ user }) => {
  return (
    <div className="p-5 md:p-8 animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-bdr pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
              Admin Control Panel <Trophy className="w-6 h-6 text-yellow-500" />
            </h1>
            <Badge color="purple">Super Admin</Badge>
          </div>
          <p className="text-muted text-sm">Manage users, monitor community discussions, and oversee platform health.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value="Manage" icon={<Brain className="w-5 h-5 text-blue-500" />} />
        <StatCard label="Total Discussions" value="Manage" icon={<MessageSquare className="w-5 h-5 text-purple-500" />} />
        <StatCard label="Reported Content" value="0" icon={<Hand className="w-5 h-5 text-red-500" />} />
        <StatCard label="System Status" value="Healthy" icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
      </div>

      <Card className="p-8 text-center border-dashed mt-6 bg-card/30">
        <FileText className="w-10 h-10 mx-auto mb-3 text-muted" />
        <p className="font-bold text-txt mb-1">Admin Tools Overview</p>
        <p className="text-muted text-sm mb-4">This is your dedicated workspace. Soon, you will be able to delete users and moderate community content directly from here.</p>
      </Card>
    </div>
  );
};

const DashboardHome = ({ onNav }) => {
  const { user, token } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my_discussions');
  
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/forum/posts`);
        const data = await res.json();
        if (data.success) {
          setAllPosts(data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard posts");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (user?.role === 'admin') {
    return <AdminDashboardView user={user} />;
  }

  const myPosts = allPosts.filter(p => p.author?._id === user?._id);
  const savedPosts = allPosts.filter(p => user?.savedPosts?.includes(p._id));

  // 🌟 THE FIX: Removed the fake "livePoints" math. 
  const totalUpvotesReceived = myPosts.reduce((sum, post) => sum + (post.upvotes?.length || 0), 0);

  const renderRoleBadge = () => {
    if (user?.plan === 'Elite') return <Badge color="purple">Elite Member</Badge>;
    if (user?.plan === 'Pro') return <Badge color="blue">Pro Member</Badge>;

    switch(user?.role) {
      case 'hr': return <Badge color="orange">HR Professional</Badge>;
      case 'recruiter': return <Badge color="green">Recruiter</Badge>;
      default: return <Badge color="ghost">Student / Candidate</Badge>;
    }
  };

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setAllPosts(prev => prev.filter(p => p._id !== postId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to delete post due to network error.");
    }
  };

  return (
    <div className="p-5 md:p-8 animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-bdr pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Candidate'} 
              <Hand className="w-6 h-6 text-yellow-500" />
            </h1>
            {renderRoleBadge()}
          </div>
          <p className="text-muted text-sm">Track your interview readiness and community impact.</p>
        </div>
        
        <div className="flex gap-2.5 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => onNav('learning')} className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> Practice Quiz
          </Button>
          <Button size="sm" onClick={() => onNav('interview')} className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" /> Start Mock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 🌟 THE FIX: Now strictly uses your official database points! */}
        <StatCard label="Community Points" value={user?.points || 0} icon={<Trophy className="w-5 h-5 text-yellow-500" />} />
        <StatCard label="My Discussions" value={loading ? '-' : myPosts.length} icon={<MessageSquare className="w-5 h-5 text-blue-500" />} />
        <StatCard label="Saved Bookmarks" value={user?.savedPosts?.length || 0} icon={<Bookmark className="w-5 h-5 text-purple-500" />} />
        <StatCard label="Upvotes Received" value={totalUpvotesReceived} icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
      </div>

      <div className="flex gap-6 border-b border-bdr px-2 mt-8">
        {['my_discussions', 'saved_posts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 bg-transparent capitalize ${activeTab === tab ? 'border-brand-lt text-txt' : 'border-transparent text-muted hover:text-txt'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'my_discussions' && (
        <div className="space-y-3 mt-6">
          {loading ? (
            <p className="text-muted text-sm animate-pulse">Loading your discussions...</p>
          ) : myPosts.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted" />
              <p className="font-bold text-txt mb-1">No Discussions Yet</p>
              <p className="text-muted text-sm mb-4">You haven't posted any questions or experiences.</p>
              <Button size="sm" onClick={() => onNav('community')}>Go to Forum</Button>
            </Card>
          ) : (
            myPosts.map(post => (
              <Card key={post._id} hover className="p-4 flex justify-between items-center cursor-pointer" onClick={() => navigate(`/community/post/${post._id}`)}>
                <div>
                  <h3 className="font-bold text-sm text-txt mb-1">{post.title}</h3>
                  <p className="text-xs text-ghost">Posted on {new Date(post.createdAt).toLocaleDateString()} · {post.views} views</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge color="blue">{post.upvotes?.length || 0} Upvotes</Badge>
                  <button 
                    onClick={(e) => handleDeletePost(e, post._id)}
                    className="text-[11px] text-red-400 hover:text-red-300 font-bold uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved_posts' && (
        <div className="space-y-3 mt-6">
          {loading ? (
            <p className="text-muted text-sm animate-pulse">Loading saved posts...</p>
          ) : savedPosts.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Bookmark className="w-10 h-10 mx-auto mb-3 text-muted" />
              <p className="font-bold text-txt mb-1">No Saved Posts</p>
              <p className="text-muted text-sm mb-4">Bookmark helpful discussions in the community to read them later.</p>
              <Button size="sm" onClick={() => onNav('community')}>Browse Forum</Button>
            </Card>
          ) : (
            savedPosts.map(post => (
              <Card key={post._id} hover className="p-4 flex justify-between items-center cursor-pointer" onClick={() => navigate(`/community/post/${post._id}`)}>
                <div>
                  <h3 className="font-bold text-sm text-txt mb-1">{post.title}</h3>
                  <p className="text-xs text-ghost">By {post.author?.name || 'Anonymous'} · {post.category}</p>
                </div>
                <span className="text-brand-lt">Read &rarr;</span>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;