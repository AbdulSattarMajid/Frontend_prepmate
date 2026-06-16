import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import CommunityWidgets from '../../components/community/CommunityWidgets';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const TAG_COLORS = { 
  'Interview Experiences': 'blue', 
  'Resume Review': 'purple',
  'Salary & Offer': 'green', 
  'General Advice': 'ghost',
  'Question': 'orange' 
};

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useApp();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // 🌟 NEW: State to hold the stats for the Widgets
  const [totalPostCount, setTotalPostCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 1. FETCH LIVE POST, COMMENTS, AND STATS ---
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        // 🌟 UPDATED: We added a fetch to get the total posts count for the widget
        const [postRes, commentsRes, statsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/forum/posts/${id}`),
          fetch(`${BASE_URL}/api/forum/posts/${id}/comments`),
          fetch(`${BASE_URL}/api/forum/posts?limit=1`) // Fetching just 1 post to get the "total" count fast
        ]);

        const postData = await postRes.json();
        const commentsData = await commentsRes.json();
        const statsData = await statsRes.json();

        if (postData.success) {
          setPost(postData.data);
        } else {
          setError('Post not found.');
        }

        if (commentsData.success) {
          setComments(commentsData.data);
        }
        
        // 🌟 Ensure the widget gets the live total count
        if (statsData.success) {
          setTotalPostCount(statsData.total);
        }
        
      } catch (err) {
        setError('Server error while fetching discussion.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // --- 2. HANDLE ADDING A COMMENT ---
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      const res = await fetch(`${BASE_URL}/api/forum/posts/${id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ text: newComment })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        setPost(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));
      }
    } catch (err) {
      alert("Failed to post comment. Please try again.");
    }
  };

  // --- 3. HANDLE DELETING A COMMENT ---
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        setPost(prev => ({ ...prev, commentCount: Math.max(0, prev.commentCount - 1) }));
      }
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  if (loading) return <div className="min-h-screen bg-deep flex items-center justify-center text-muted animate-pulse">Loading discussion...</div>;
  if (error || !post) return <div className="min-h-screen bg-deep flex items-center justify-center text-red-400">{error || 'Post not found'}</div>;

  const authorName = post.author?.name || 'Anonymous';
  const postDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-deep">
      <nav className="px-6 py-4 border-b border-bdr flex justify-between items-center bg-deep">
        <Logo onClick={() => navigate('/')} />
        <Button size="sm" variant="ghost" onClick={() => navigate('/community')}>← Back to Forum</Button>
      </nav>

      <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDE: MAIN CONTENT --- */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Post Content Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-ghost">
                <Avatar name={authorName} size={28} />
                <span className="font-bold text-muted text-sm">{authorName}</span>
                <span>• {postDate}</span>
              </div>
              {post.category && (
                <Badge color={TAG_COLORS[post.category] || 'blue'} size="sm">{post.category}</Badge>
              )}
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black mb-4 leading-tight text-txt">{post.title}</h1>
            
            {post.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden border border-bdr2 bg-card2/50 flex justify-center">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="max-w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            )}

            <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center gap-5 mt-6 pt-4 border-t border-bdr text-xs font-semibold text-ghost">
              <span className="flex items-center gap-1.5"><span className="text-base">↑</span> {post.upvotes?.length || 0} Upvotes</span>
              <span className="flex items-center gap-1.5"><span className="text-sm">👁</span> {post.views || 0} Views</span>
            </div>
          </Card>

          {/* Comments Feed Block */}
          <div className="space-y-4">
            <h3 className="font-bold text-base px-1">Discussion ({post.commentCount || 0})</h3>
            
            <Card className="p-4 space-y-4">
              <Textarea 
                placeholder={user ? "Write your response constructively..." : "Please log in to join the discussion."} 
                value={newComment} 
                onChange={setNewComment} 
                rows={3}
                disabled={!user}
              />
              <div className="flex justify-end">
                {!user ? (
                  <Button size="sm" onClick={() => navigate('/login')}>Log in to comment</Button>
                ) : (
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>Post Comment</Button>
                )}
              </div>
            </Card>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-ghost text-sm">No comments yet. Be the first to share your thoughts!</div>
              ) : (
                comments.map(c => {
                  const commentAuthor = c.author?.name || 'Anonymous';
                  const commentDate = new Date(c.createdAt).toLocaleDateString();
                  const isCommentOwner = user && c.author?._id === user._id;

                  return (
                    <Card key={c._id} className="p-5 bg-card/40 relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-ghost">
                          <Avatar name={commentAuthor} size={20} />
                          <span className="font-bold text-muted">{commentAuthor}</span>
                          <span>• {commentDate}</span>
                          {c.author?.role === 'admin' && <Badge color="purple" size="sm">ADMIN</Badge>}
                        </div>
                        
                        {isCommentOwner && (
                          <button 
                            onClick={() => handleDeleteComment(c._id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-red-400 hover:text-red-300 font-bold uppercase bg-transparent border-0 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-muted text-sm leading-relaxed">{c.text}</p>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 🌟 UPDATED: Pass the totalPostCount down to the widget */}
        <CommunityWidgets totalPosts={totalPostCount} />
      </div>
    </div>
  );
};

export default SinglePostPage;