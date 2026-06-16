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
  Clock, 
  FileText, 
  MoreHorizontal 
} from 'lucide-react';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const TREND_PTS = [[0,80],[1,82],[2,78],[3,85],[4,87],[5,84],[6,88],[7,90],[8,88],[9,92]];
const UPCOMING  = [
  { role:'Frontend Dev',  company:'Google', type:'Video Call',  time:'Tomorrow, 10:00 AM', urgent:true,  emoji:'G' },
  { role:'Software Engineer',company:'Microsoft',type:'Technical',     time:'Oct 24, 2:00 PM',    urgent:false, emoji:'M' },
];

// 🌟 NEW: THE ADMIN DASHBOARD VIEW
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
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Live Forum Data State
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

  // 🌟 THE FIX: The Traffic Cop! 
  // If the user is an admin, stop here and show the Admin UI instead.
  if (user?.role === 'admin') {
    return <AdminDashboardView user={user} />;
  }

  // --- EVERYTHING BELOW THIS LINE ONLY SHOWS FOR NORMAL CANDIDATES ---

  // Filter posts for this specific user
  const myPosts = allPosts.filter(p => p.author?._id === user?._id);
  const savedPosts = allPosts.filter(p => user?.savedPosts?.includes(p._id));

  const SVG_W=500, SVG_H=110, PX=20, PY=10;
  const xs = TREND_PTS.map(([i]) => PX + (i/9)*(SVG_W-2*PX));
  const ys = TREND_PTS.map(([,v]) => SVG_H - PY - ((v-75)/25)*(SVG_H-2*PY));
  const pathD = xs.map((x,i) => `${i===0?'M':'L'}${x},${ys[i]}`).join(' ');
  const areaD   = pathD + ` L${xs[xs.length-1]},${SVG_H-PY} L${xs[0]},${SVG_H-PY} Z`;

  const renderRoleBadge = () => {
    switch(user?.role) {
      case 'hr': return <Badge color="orange">HR Professional</Badge>;
      case 'recruiter': return <Badge color="green">Recruiter</Badge>;
      default: return <Badge color="blue">Student / Candidate</Badge>;
    }
  };

  return (
    <div className="p-5 md:p-8 animate-fade-up space-y-6">
      {/* HEADER SECTION */}
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

      {/* DYNAMIC STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Community Points" value={user?.communityPoints || 0} icon={<Trophy className="w-5 h-5 text-yellow-500" />} />
        <StatCard label="My Discussions" value={loading ? '-' : myPosts.length} icon={<MessageSquare className="w-5 h-5 text-blue-500" />} />
        <StatCard label="Saved Bookmarks" value={user?.savedPosts?.length || 0} icon={<Bookmark className="w-5 h-5 text-purple-500" />} />
        <StatCard label="Avg. Confidence" value="85%" change="5% vs last week" changePositive icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex gap-6 border-b border-bdr px-2 mt-8">
        {['overview', 'my_discussions', 'saved_posts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 bg-transparent capitalize ${activeTab === tab ? 'border-brand-lt text-txt' : 'border-transparent text-muted hover:text-txt'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-6">
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-base">Readiness Score Trend</p>
                <p className="text-xs text-ghost mt-0.5">AI-calculated preparedness · last 30 days</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-ghost cursor-pointer" />
            </div>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ height:120 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#chartGrad)" />
              <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={xs[9]} cy={ys[9]} r="6" fill="#3b82f6" />
              <rect x={xs[9]-28} y={ys[9]-30} width={56} height={22} rx="6" fill="white" opacity="0.95" />
              <text x={xs[9]} y={ys[9]-15} textAnchor="middle" fontSize="12" fontWeight="700" fill="#111">92%</text>
            </svg>
            <div className="flex justify-between text-[11px] text-ghost mt-2">
              {['WEEK 1','WEEK 2','WEEK 3','CURRENT'].map(l => <span key={l}>{l}</span>)}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-sm">Upcoming Interviews</p>
                <button className="text-brand-lt text-xs bg-transparent border-0 cursor-pointer">View all</button>
              </div>
              <div className="space-y-4">
                {UPCOMING.map(u => (
                  <div key={u.role} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-lt flex items-center justify-center font-black text-white text-base flex-shrink-0">
                      {u.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{u.role}</p>
                      <p className="text-xs text-ghost">{u.company} · {u.type}</p>
                      <Badge color={u.urgent ? 'orange':'blue'} className="mt-1 flex items-center gap-1 w-fit">
                        {u.urgent && <Clock className="w-3 h-3 inline-block" />}
                        {u.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY DISCUSSIONS */}
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
                <Badge color="blue">{post.upvotes?.length || 0} Upvotes</Badge>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED POSTS */}
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