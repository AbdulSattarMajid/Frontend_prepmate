import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const CommunityWidgets = ({ totalPosts, trendingTags = [] }) => {
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH LIVE LEADERBOARD FROM DATABASE
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/forum/posts/leaderboard`);
        const data = await res.json();
        
        if (data.success) {
          setTopContributors(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <aside className="hidden xl:flex flex-col gap-5 w-72 flex-shrink-0">
      
      {/* Live Stats */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-lt text-lg">📊</span>
          <p className="font-bold text-sm">Community Stats</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-2xl font-black font-sora text-txt mb-0.5">Live</p>
            <p className="text-[10px] text-ghost tracking-wider uppercase">Status</p>
          </div>
          <div>
            <p className="text-2xl font-black font-sora text-brand-lt mb-0.5">{totalPosts || 0}</p>
            <p className="text-[10px] text-ghost tracking-wider uppercase">Total Posts</p>
          </div>
        </div>
      </Card>

      {/* DYNAMIC Trending Now - Only shows if tags exist */}
      {trendingTags.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-lt text-lg">📈</span>
            <p className="font-bold text-sm">Trending Now</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <button key={tag} className="px-3 py-1.5 bg-card2 border border-bdr2 rounded-lg text-[11px] font-medium text-muted hover:border-brand-lt hover:text-brand-lt transition-all duration-150">
                {tag}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Live Top Contributors */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-brand-lt text-lg">🏆</span>
          <p className="font-bold text-sm">Top Contributors</p>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-muted animate-pulse">Loading leaders...</p>
          ) : topContributors.length === 0 ? (
            <p className="text-xs text-muted">No contributors yet.</p>
          ) : (
            topContributors.map((c, index) => {
              const colors = ['#f59e0b', '#8b949e', '#cd7f32'];
              const rankColor = colors[index] || '#4b5563';

              return (
                <div key={c._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size={32} />
                    <div>
                      <p className="text-sm font-bold text-txt">{c.name}</p>
                      <p className="text-[11px] text-ghost">{c.points} pts</p>
                    </div>
                  </div>
                  <span className="font-black text-sm" style={{ color: rankColor }}>#{index + 1}</span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </aside>
  );
};

export default CommunityWidgets;