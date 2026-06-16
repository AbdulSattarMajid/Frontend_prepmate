import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import { COMMUNITY_POSTS } from '../../data/mockData';
import { sanitiseInput } from '../../utils/helpers';

const MENU_ITEMS = [
  { icon: '💬', label: 'All Discussions', active: true },
  { icon: '🔥', label: 'Popular', active: false },
  { icon: '✅', label: 'Solved', active: false },
  { icon: '🔖', label: 'Saved', active: false },
];

const TOPICS = [
  { dot:'#3b82f6', label:'Interview Experiences', count:124 },
  { dot:'#8b5cf6', label:'Resume Review',         count:85  },
  { dot:'#3fb950', label:'Salary & Offer',        count:42  },
  { dot:'#f59e0b', label:'General Advice',        count:210 },
];

const TRENDING_TAGS = ['#SystemDesign','#Meta','#Negotiation','#Recession','#Java','#NewGrad'];

const TOP_CONTRIBUTORS = [
  { name:'Mark T.',  pts:'1,240 pts', rank:1, color:'#f59e0b' },
  { name:'Emily R.', pts:'980 pts',   rank:2, color:'#8b949e' },
  { name:'User_99',  pts:'650 pts',   rank:3, color:'#cd7f32' },
];

const TAG_COLORS = { 'Interview Experience':'blue', Question:'orange', Salary:'green', ADMIN:'purple', General:'ghost' };

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  const [posts, setPosts]         = useState(COMMUNITY_POSTS);
  const [upvoted, setUpvoted]     = useState({});
  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('Latest');
  const [showModal, setShowModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody]   = useState('');
  const [postTag, setPostTag]     = useState('Question');
  const [emailSub, setEmailSub]   = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleUpvote = (id) => {
    const wasUpvoted = upvoted[id];
    setUpvoted(prev => ({ ...prev, [id]: !wasUpvoted }));
    setPosts(prev => prev.map(p => p.id===id ? { ...p, upvotes: p.upvotes + (wasUpvoted ? -1 : 1) } : p));
  };

  const handlePost = () => {
    if (!postTitle.trim()) return;
    const newPost = {
      id: Date.now(), pinned:false, author: user?.name||'Anonymous', time:'Just now', isAdmin:false,
      tag: postTag, tagColor: TAG_COLORS[postTag]||'blue',
      title: sanitiseInput(postTitle), body: sanitiseInput(postBody),
      upvotes:0, comments:0, views:null, tags:[],
    };
    setPosts(prev => [newPost, ...prev]);
    setPostTitle(''); setPostBody(''); setShowModal(false);
  };

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-deep">
      {/* --- HERO SECTION --- */}
      <div className="py-16 px-4 text-center border-b border-bdr">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
          Find answers, share wisdom, get hired.
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join 10,000+ candidates discussing interview questions, salary negotiations, and success stories.
        </p>

        {/* Big Search Bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <Input
            placeholder="Search for companies, questions, or topics..."
            value={search}
            onChange={setSearch}
            icon="🔍"
            className="w-full bg-card2 border-bdr2 text-left"
          />
        </div>
        <p className="text-xs text-ghost">
          Popular searches: 
          <span className="text-muted hover:text-txt cursor-pointer ml-2">Google L4</span> · 
          <span className="text-muted hover:text-txt cursor-pointer mx-1">System Design</span> · 
          <span className="text-muted hover:text-txt cursor-pointer mx-1">Amazon LP</span>
        </p>
      </div>

      {/* --- MAIN 3-COLUMN LAYOUT --- */}
      <div className="max-w-[1300px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
          <Button 
            size="lg" 
            fullWidth 
            onClick={() => { user ? setShowModal(true) : navigate('/signup'); }}
            className="font-bold text-sm"
          >
            + Start Discussion
          </Button>

          <div>
            <p className="text-[11px] font-bold text-ghost tracking-widest uppercase mb-3 px-3">Menu</p>
            <div className="space-y-1">
              {MENU_ITEMS.map(item => (
                <button 
                  key={item.label} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-0 ${item.active ? 'bg-card text-txt font-semibold' : 'bg-transparent text-muted hover:text-txt hover:bg-card/50'}`}
                >
                  <span className="text-base">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-ghost tracking-widest uppercase mb-3 px-3">Topics</p>
            <div className="space-y-1">
              {TOPICS.map(t => (
                <button 
                  key={t.label} 
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted hover:text-txt hover:bg-card/50 transition-colors bg-transparent border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background:t.dot }} />
                    <span>{t.label}</span>
                  </div>
                  <span className="text-[11px] bg-card2 px-2 py-0.5 rounded-full border border-bdr2">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN (Feed) */}
        <div className="flex-1 min-w-0">
          {/* Clean Tabs */}
          <div className="flex gap-6 border-b border-bdr mb-6 px-2">
            {['Latest','Top (Week)','Top (Month)','Unanswered'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 bg-transparent ${activeTab===tab ? 'border-brand-lt text-txt' : 'border-transparent text-muted hover:text-txt'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filtered.map(post => (
              <Card key={post.id} hover className={`p-5 ${post.pinned ? 'border-brand/30 bg-brand/[0.03]' : ''}`}>
                
                {/* Post Header: Avatar, Name, Time, Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={post.author} size={24} />
                    <span className="font-bold text-sm text-txt">{post.author}</span>
                    <span className="text-xs text-ghost">• {post.time}</span>
                  </div>
                  <div className="flex gap-2">
                    {post.isAdmin && <Badge color="purple" size="sm">ADMIN</Badge>}
                    {post.pinned && <span className="text-ghost text-sm">📌</span>}
                    {!post.isAdmin && !post.pinned && post.tag && <Badge color={TAG_COLORS[post.tag]||'blue'} size="sm">{post.tag}</Badge>}
                  </div>
                </div>

                {/* Post Body */}
                <h3 className="font-bold text-lg mb-2 leading-snug">{post.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{post.body}</p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {post.tags.map(t => (
                      <span key={t} className="text-[11px] font-medium bg-card2 text-muted px-2 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Footer: Actions */}
                <div className="flex items-center justify-between text-xs font-semibold text-ghost pt-1">
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center gap-1.5 bg-transparent border-0 transition-colors ${upvoted[post.id] ? 'text-brand-lt' : 'hover:text-txt'}`}
                    >
                      <span className="text-base">↑</span> {post.upvotes}
                    </button>
                    <button className="flex items-center gap-1.5 bg-transparent border-0 hover:text-txt transition-colors">
                      <span className="text-sm">💬</span> {post.comments} Comments
                    </button>
                    {post.views && (
                      <span className="flex items-center gap-1.5 cursor-default">
                        <span className="text-sm">👁</span> {post.views}
                      </span>
                    )}
                  </div>
                  <button className="bg-transparent border-0 text-lg hover:text-txt transition-colors">
                    🔗
                  </button>
                </div>
              </Card>
            ))}
            
            {/* Load More */}
            <button className="w-full py-4 text-xs font-bold text-muted hover:text-txt bg-transparent border-0 transition-colors">
              Load More Discussions ∨
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Widgets) */}
        <aside className="hidden xl:flex flex-col gap-5 w-72 flex-shrink-0">
          
          {/* Stats Widget */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-lt text-lg">📊</span>
              <p className="font-bold text-sm">Community Stats</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-2xl font-black font-sora text-txt mb-0.5">124</p>
                <p className="text-[10px] text-ghost tracking-wider uppercase">Online</p>
              </div>
              <div>
                <p className="text-2xl font-black font-sora text-txt mb-0.5">5.2k</p>
                <p className="text-[10px] text-ghost tracking-wider uppercase">Members</p>
              </div>
            </div>
            <div>
              <p className="text-xl font-black font-sora text-txt mb-0.5">18k</p>
              <p className="text-[10px] text-ghost tracking-wider uppercase">Posts</p>
            </div>
          </Card>

          {/* Trending Widget */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-lt text-lg">📈</span>
              <p className="font-bold text-sm">Trending Now</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map(tag => (
                <button
                  key={tag}
                  className="px-3 py-1.5 bg-card2 border border-bdr2 rounded-lg text-[11px] font-medium text-muted hover:border-brand-lt hover:text-brand-lt transition-all duration-150"
                >
                  {tag}
                </button>
              ))}
            </div>
          </Card>

          {/* Top Contributors Widget */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-brand-lt text-lg">🏆</span>
              <p className="font-bold text-sm">Top Contributors</p>
            </div>
            <div className="space-y-4">
              {TOP_CONTRIBUTORS.map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size={32} />
                    <div>
                      <p className="text-sm font-bold text-txt">{c.name}</p>
                      <p className="text-[11px] text-ghost">{c.pts}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm" style={{ color:c.color }}>#{c.rank}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-ghost mt-2 px-2">
            {['About','Guidelines','Privacy','Terms'].map(l => (
              <button key={l} className="bg-transparent border-0 hover:text-muted transition-colors p-0">{l}</button>
            ))}
            <p className="w-full mt-2">© 2026 PrepMate</p>
          </div>
        </aside>
      </div>

      {/* --- WEEKLY DIGEST FOOTER --- */}
      <div className="mt-12 bg-[#0d1117] py-16 px-4 text-center border-t border-bdr">
        <div className="w-12 h-12 rounded-full bg-card border border-bdr2 flex items-center justify-center text-xl mx-auto mb-6 text-brand-lt">
          ✉️
        </div>
        <h2 className="text-2xl font-black mb-3">Weekly Interview Digest</h2>
        <p className="text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Get the top interview questions and success stories delivered to your inbox every Monday.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <Input
            placeholder="Enter your email"
            value={emailSub}
            onChange={setEmailSub}
            type="email"
            className="flex-1 bg-card border-bdr2 text-sm"
          />
          <Button
            onClick={() => emailSub && setSubscribed(true)}
            variant={subscribed ? 'ghost' : 'primary'}
            className="whitespace-nowrap font-bold"
          >
            {subscribed ? '✓ Subscribed!' : 'Subscribe'}
          </Button>
        </div>
      </div>

      {/* --- NEW POST MODAL --- */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Start a Discussion">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-muted mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {['Question','Interview Experience','Salary','General'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setPostTag(tag)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-semibold font-sora transition-all ${postTag===tag ? 'border-brand-lt bg-brand/15 text-brand-lt' : 'border-bdr2 bg-transparent text-muted hover:text-txt'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <Input label="Title" placeholder="What's your question or topic?" value={postTitle} onChange={setPostTitle} />
          <Textarea label="Details (optional)" placeholder="Share more context…" value={postBody} onChange={setPostBody} rows={4} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handlePost} disabled={!postTitle.trim()}>Post Discussion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage;