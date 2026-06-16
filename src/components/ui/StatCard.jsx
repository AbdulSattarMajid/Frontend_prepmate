import Card from './Card';
const StatCard = ({ label, value, change, changePositive, icon }) => (
  <Card className="flex-1">
    <div className="flex justify-between items-start mb-3">
      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-xl">{icon}</div>
      {change && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changePositive ? 'text-green-400 bg-green-500/10':'text-red-400 bg-red-500/10'}`}>
          {changePositive?'↑':'↓'} {change}
        </span>
      )}
    </div>
    <p className="text-xs text-muted mb-1">{label}</p>
    <p className="text-3xl font-extrabold font-sora">{value}</p>
  </Card>
);

export default StatCard;
