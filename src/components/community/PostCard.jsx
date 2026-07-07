import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { Pin, ArrowUp, MessageSquare, Eye, Link, Bookmark } from 'lucide-react'; 

const TAG_COLORS = { 
  'Interview Experiences': 'blue', 
  'Resume Review': 'purple',
  'Salary & Offer': 'green', 
  'General Advice': 'ghost',
  'Question': 'orange' 
};

// 🌟 2. Added isSaved and onSave to props
const PostCard = ({ post, isUpvoted, onUpvote, onClick, currentUserId, onEdit, onDelete, isSaved, onSave }) => {
  const { user } = useApp(); 
  
  // Security check for edit/delete buttons
  const hasPermissions = user && (user._id === post.authorId || user.role === 'admin');

  return (
    <Card hover className={`p-5 cursor-pointer ${post.pinned ? 'border-brand/30 bg-brand/[0.03]' : ''}`} onClick={onClick}>
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={post.author?.name || post.author || 'Anonymous'} size={24} />
          <span className="font-bold text-sm text-txt">{post.author?.name || post.author || 'Anonymous'}</span>
          <span className="text-xs text-ghost">• {post.time || new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {post.isAdmin && <Badge color="purple" size="sm">ADMIN</Badge>}
          
          {/* 🌟 Replaced Pin Emoji */}
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
          
          {/* 🌟 Replaced Upvote Emoji */}
          <button 
            onClick={() => onUpvote(post._id || post.id)}
            className={`flex items-center gap-1.5 bg-transparent border-0 transition-colors ${isUpvoted ? 'text-brand-lt' : 'hover:text-txt'} cursor-pointer`}
          >
            <ArrowUp className={`w-4 h-4 ${isUpvoted ? 'text-brand-lt' : ''}`} strokeWidth={3} /> 
            {post.upvotes?.length || post.upvotes || 0}
          </button>
          
          {/* 🌟 Replaced Comment Emoji */}
          <button className="flex items-center gap-1.5 bg-transparent border-0 hover:text-txt transition-colors cursor-pointer" onClick={onClick}>
            <MessageSquare className="w-4 h-4" /> 
            {post.comments?.length || post.commentCount || post.comments || 0} Comments
          </button>
          
          {/* 🌟 Replaced View Emoji */}
          {(post.views > 0 || post.views === 0) && (
            <span className="flex items-center gap-1.5 cursor-default">
              <Eye className="w-4 h-4" /> {post.views}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* 🌟 NEW: Bookmark/Save Icon */}
          <button 
            onClick={() => onSave(post._id || post.id)}
            className={`bg-transparent border-0 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-md hover:bg-card2 ${isSaved ? 'text-purple-500' : 'text-ghost hover:text-txt'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-purple-500' : ''}`} />
          </button>

          {/* 🌟 Replaced Link Emoji */}
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/community/post/${post._id || post.id}`);
              alert('Link copied to clipboard!');
            }}
            className="bg-transparent border-0 hover:text-txt transition-colors cursor-pointer"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Card>
  );
};

export default PostCard;