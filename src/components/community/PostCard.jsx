import { useState } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';
// Added Briefcase to your lucide-react imports
import { Pin, ArrowUp, MessageSquare, Eye, Link, Bookmark, Briefcase } from 'lucide-react'; 

const TAG_COLORS = { 
  'Interview Experiences': 'blue', 
  'Resume Review': 'purple',
  'Salary & Offer': 'green', 
  'General Advice': 'ghost',
  'Question': 'orange' 
};

const PostCard = ({ post, isUpvoted, onUpvote, onClick, currentUserId, onEdit, onDelete, isSaved, onSave }) => {
  const { user } = useApp(); 
  
  const [copied, setCopied] = useState(false);
  
  const hasPermissions = user && (user._id === post.authorId || user.role === 'admin');

  // Safely lowercase the plan for our checks
  const userPlan = post.plan ? post.plan.toLowerCase() : 'basic';

  const handleCopyLink = (e) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(`${window.location.origin}/community/post/${post._id || post.id}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card hover className={`p-5 cursor-pointer ${post.pinned ? 'border-brand/30 bg-brand/[0.03]' : ''}`} onClick={onClick}>
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={post.author?.name || post.author || 'Anonymous'} size={24} />
          
          {/* 🌟 CHECKING userPlan INSTEAD OF post.plan */}
          <span className={`font-bold text-sm ${userPlan === 'elite' ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500' : 'text-txt'}`}>
            {post.author?.name || post.author || 'Anonymous'}
          </span>

          {userPlan === 'pro' && (
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-[9px] font-black tracking-widest shadow-sm">
              PRO
            </span>
          )}
          {userPlan === 'elite' && (
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 text-black rounded text-[9px] font-black tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              ELITE
            </span>
          )}
          
          {/* 🌟 NEW: Recruiter & HR Badge */}
          {(userPlan === 'recruiter' || userPlan === 'hr') && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded text-[9px] font-black tracking-widest uppercase shadow-sm">
              <Briefcase className="w-2.5 h-2.5" />
              {userPlan === 'hr' ? 'HR' : 'RECRUITER'}
            </span>
          )}

          <span className="text-xs text-ghost ml-1">• {post.time || new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {post.isAdmin && <Badge color="purple" size="sm">ADMIN</Badge>}
          {post.pinned && <Pin className="w-4 h-4 text-ghost" />}
          {!post.isAdmin && !post.pinned && post.tag && <Badge color={TAG_COLORS[post.tag] || 'blue'} size="sm">{post.tag}</Badge>}
          
          {hasPermissions && (
            <div className="flex gap-3 ml-2 border-l border-bdr pl-3" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => onEdit(post)} 
                className="text-[11px] text-muted hover:text-brand-lt font-bold uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(post._id || post.id)} 
                className="text-[11px] text-red-400 hover:text-red-300 font-bold uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2 leading-snug hover:text-brand-lt transition-colors">{post.title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{post.body}</p>
      
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden border border-bdr2 bg-card2 flex justify-center">
          <img 
            src={post.imageUrl} 
            alt="Post attachment" 
            className="max-h-64 w-auto object-contain"
          />
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2 mb-4">
          {post.tags.map(t => (
            <span key={t} className="text-[11px] font-medium bg-card2 text-muted px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between text-xs font-semibold text-ghost pt-1" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onUpvote(post._id || post.id)}
            className={`flex items-center gap-1.5 bg-transparent border-0 transition-colors ${isUpvoted ? 'text-brand-lt' : 'hover:text-txt'} cursor-pointer`}
          >
            <ArrowUp className={`w-4 h-4 ${isUpvoted ? 'text-brand-lt' : ''}`} strokeWidth={3} /> 
            {post.upvotes?.length || post.upvotes || 0}
          </button>
          
          <button className="flex items-center gap-1.5 bg-transparent border-0 hover:text-txt transition-colors cursor-pointer" onClick={onClick}>
            <MessageSquare className="w-4 h-4" /> 
            {post.comments?.length || post.commentCount || post.comments || 0} Comments
          </button>
          
          {(post.views > 0 || post.views === 0) && (
            <span className="flex items-center gap-1.5 cursor-default">
              <Eye className="w-4 h-4" /> {post.views}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSave(post._id || post.id)}
            className={`bg-transparent border-0 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-md hover:bg-card2 ${isSaved ? 'text-purple-500' : 'text-ghost hover:text-txt'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-purple-500' : ''}`} />
          </button>

          <div className="relative flex items-center">
            <button 
              onClick={handleCopyLink}
              className={`bg-transparent border-0 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-md hover:bg-card2 ${copied ? 'text-green-500' : 'text-ghost hover:text-txt'}`}
            >
              {copied ? <span className="text-sm">✅</span> : <Link className="w-4 h-4" />}
            </button>
            
            {copied && (
              <span className="absolute -top-8 right-0 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap shadow-sm">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;