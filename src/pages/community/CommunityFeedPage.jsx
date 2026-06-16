import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';

import CommunitySidebar from '../../components/community/CommunitySidebar';
import CommunityWidgets from '../../components/community/CommunityWidgets';
import PostCard from '../../components/community/PostCard';
import { sanitiseInput } from '../../utils/helpers';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const CommunityFeedPage = () => {
  const navigate = useNavigate();
  const { user, token } = useApp();
  
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [search, setSearch]       = useState('');
  const [activeTab, setActiveTab] = useState('Latest');
  
  // Sidebar Filter States
  const [activeMenu, setActiveMenu] = useState('all');
  const [activeTopic, setActiveTopic] = useState(null);
  const [totalPostCount, setTotalPostCount] = useState(0);
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody]   = useState('');
  const [postTag, setPostTag]     = useState('Question');
  
  // State to hold the uploaded image file
  const [postImage, setPostImage] = useState(null);

  // --- DYNAMIC FETCH POSTS ---
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        if (activeTab.includes('Top') || activeMenu === 'popular') {
          queryParams.append('sort', 'top');
        }
        if (activeTopic) {
          queryParams.append('category', activeTopic);
        }
        if (search) {
          queryParams.append('search', search);
        }

        const res = await fetch(`${BASE_URL}/api/forum/posts?${queryParams.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setPosts(data.data);
          setTotalPostCount(data.total); 
        } else {
          setError('Failed to load discussions.');
        }
      } catch (err) {
        setError('Server error connecting to the forum.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, activeMenu, activeTopic, search]);

  const trendingTags = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const tagCounts = {};
    posts.forEach(p => {
      if (p.category) {
        tagCounts[p.category] = (tagCounts[p.category] || 0) + 1;
      }
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 5) 
      .map(entry => `#${entry[0].replace(/\s+/g, '')}`); 
  }, [posts]);

  // --- HANDLE UPVOTES ---
  const handleUpvote = async (id) => {
    if (!user) return navigate('/login');

    setPosts(prev => prev.map(p => {
      if (p._id === id) {
        const upvotesList = p.upvotes || []; 
        const isCurrentlyUpvoted = upvotesList.includes(user._id);
        
        return {
          ...p,
          upvotes: isCurrentlyUpvoted 
            ? upvotesList.filter(uid => uid !== user._id) 
            : [...upvotesList, user._id]
        };
      }
      return p;
    }));

    try {
      await fetch(`${BASE_URL}/api/forum/posts/${id}/upvote`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to sync upvote");
    }
  };

  // --- HANDLE CREATING OR EDITING A POST ---
  const handlePost = async () => {
    if (!postTitle.trim() || !postBody.trim()) return;
    
    try {
      const url = editingPostId 
        ? `${BASE_URL}/api/forum/posts/${editingPostId}`
        : `${BASE_URL}/api/forum/posts`;
      const method = editingPostId ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('title', sanitiseInput(postTitle));
      formData.append('content', sanitiseInput(postBody));
      formData.append('category', postTag);
      formData.append('isAnonymous', false);
      
      if (postImage) {
        formData.append('image', postImage);
      }

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        if (editingPostId) {
          setPosts(prev => prev.map(p => p._id === editingPostId ? data.data : p));
        } else {
          setPosts(prev => [data.data, ...prev]);
        }
        closeModal();
      } else {
        // This alerts you if Cloudinary or the server rejects the upload
        alert(`Upload Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to save post", err);
      alert("A network error occurred while uploading. Please check the console.");
    }
  };

  // --- HANDLE DELETE ---
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
    
    try {
      const res = await fetch(`${BASE_URL}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setPosts(prev => prev.filter(p => p._id !== postId));
      }
    } catch (err) {
      alert("Failed to delete post. Please try again.");
    }
  };

  // --- PREPARE MODAL FOR EDITING ---
  const openEditModal = (post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostBody(post.body);
    setPostTag(post.tag || 'Question');
    setPostImage(null); 
    setShowModal(true);
  };

  // --- CLEANUP MODAL ---
  const closeModal = () => {
    setShowModal(false);
    setEditingPostId(null);
    setPostTitle('');
    setPostBody('');
    setPostTag('Question');
    setPostImage(null); 
  };

  const filtered = posts.filter(p =>
    !search || 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-deep pb-24">
      {/* HERO SECTION */}
      <div className="py-16 px-4 text-center border-b border-bdr">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
          Find answers, share wisdom, get hired.
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join candidates discussing interview questions, salary negotiations, and success stories.
        </p>

        <div className="max-w-2xl mx-auto mb-4">
          <Input
            placeholder="Search for companies, questions, or topics..."
            value={search}
            onChange={setSearch}
            icon="🔍"
            className="w-full bg-card2 border-bdr2 text-left"
          />
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1300px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* --- CONNECTED LEFT SIDEBAR --- */}
        <CommunitySidebar 
          navigate={navigate} 
          user={user} 
          onStartDiscussion={() => { user ? setShowModal(true) : navigate('/login'); }} 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
        />

        {/* FEED */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-6 border-b border-bdr mb-6 px-2">
            {['Latest', 'Top (Week)', 'Top (Month)', 'Unanswered'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 bg-transparent ${activeTab===tab ? 'border-brand-lt text-txt' : 'border-transparent text-muted hover:text-txt'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-muted animate-pulse">Loading discussions...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-muted">No discussions found. Be the first to post!</div>
            ) : (
              filtered.map(post => {
                const postForCard = {
                  id: post._id,
                  authorId: post.author?._id,
                  title: post.title,
                  body: post.content,
                  imageUrl: post.imageUrl,
                  author: post.author?.name || 'Anonymous',
                  tag: post.category,
                  upvotes: post.upvotes?.length || 0,
                  comments: post.commentCount || 0,
                  views: post.views || 0,
                  pinned: post.pinned,
                  isAdmin: post.author?.role === 'admin',
                  time: new Date(post.createdAt).toLocaleDateString()
                };

                return (
                  <PostCard 
                    key={post._id} 
                    post={postForCard} 
                    currentUserId={user?._id}
                    isUpvoted={user && post.upvotes?.includes(user._id)} 
                    onUpvote={() => handleUpvote(post._id)} 
                    onEdit={() => openEditModal(postForCard)}
                    onDelete={() => handleDelete(post._id)}
                    onClick={() => navigate(`/community/post/${post._id}`)} 
                  />
                );
              })
            )}
          </div>
        </div>

        {/* --- CONNECTED RIGHT SIDEBAR --- */}
        <CommunityWidgets totalPosts={totalPostCount} trendingTags={trendingTags} />
      </div>

      {/* DISCUSSION MODAL */}
      <Modal open={showModal} onClose={closeModal} title={editingPostId ? "Edit Discussion" : "Start a Discussion"}>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-muted mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {['Question', 'Interview Experiences', 'Salary & Offer', 'General Advice', 'Resume Review'].map(tag => (
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
          <Textarea label="Details" placeholder="Share more context…" value={postBody} onChange={setPostBody} rows={4} />
          
          {/* Image Upload Input */}
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Attach an Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setPostImage(e.target.files[0])}
              className="w-full bg-card2 border border-bdr2 text-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand/10 file:text-brand-lt hover:file:bg-brand/20 cursor-pointer"
            />
            <p className="text-[10px] text-muted mt-1">PNG, JPG, or GIF. Max 2MB.</p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button onClick={handlePost} disabled={!postTitle.trim() || !postBody.trim()}>
              {editingPostId ? "Save Changes" : "Post Discussion"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityFeedPage;