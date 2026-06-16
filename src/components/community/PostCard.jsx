import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext'; // 🌟 1. Import AppContext

const TAG_COLORS = { 
  'Interview Experiences': 'blue', 
  'Resume Review': 'purple',
  'Salary & Offer': 'green', 
  'General Advice': 'ghost',
  'Question': 'orange' 
};

const PostCard = ({ post, isUpvoted, onUpvote, onClick, currentUserId, onEdit, onDelete }) => {
  const { user } = useApp(); // 🌟 2. Get the global user object
  
  // 🌟 3. NEW SECURITY CHECK: Are they the author OR an admin?
  const hasPermissions = user && (user._id === post.authorId || user.role === 'admin');

  return (
    <Card hover className={`p-5 cursor-pointer ${post.pinned ? 'border-brand/30 bg-brand/[0.03]' : ''}`} onClick={onClick}>
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={post.author} size={24} />
          <span className="font-bold text-sm text-txt">{post.author}</span>
          <span className="text-xs text-ghost">• {post.time}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {post.isAdmin && <Badge color="purple" size="sm">ADMIN</Badge>}
          {post.pinned && <span className="text-ghost text-sm">📌</span>}
          {!post.isAdmin && !post.pinned && post.tag && <Badge color={TAG_COLORS[post.tag] || 'blue'} size="sm">{post.tag}</Badge>}
          
          {/* 🌟 4. Check permissions here */}
          {hasPermissions && (
            <div className="flex gap-3 ml-2 border-l border-bdr pl-3" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => onEdit(post)} 
                className="text-[11px] text-muted hover:text-brand-lt font-bold uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(post.id)} 
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

      <div className="flex items-center justify-between text-xs font-semibold text-ghost pt-1" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onUpvote(post.id)}
            className={`flex items-center gap-1.5 bg-transparent border-0 transition-colors ${isUpvoted ? 'text-brand-lt' : 'hover:text-txt'} cursor-pointer`}
          >
            <span className="text-base">↑</span> {post.upvotes}
          </button>
          <button className="flex items-center gap-1.5 bg-transparent border-0 hover:text-txt transition-colors cursor-pointer" onClick={onClick}>
            <span className="text-sm">💬</span> {post.comments} Comments
          </button>
          {post.views > 0 && (
            <span className="flex items-center gap-1.5 cursor-default">
              <span className="text-sm">👁</span> {post.views}
            </span>
          )}
        </div>
        <button className="bg-transparent border-0 text-lg hover:text-txt transition-colors cursor-pointer">🔗</button>
      </div>
    </Card>
  );
};

export default PostCard;