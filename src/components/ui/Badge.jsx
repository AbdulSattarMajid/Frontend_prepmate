const BADGE_VARIANTS = {
  blue:   'bg-blue-500/10 text-blue-400 border-blue-500/25',
  green:  'bg-green-500/10 text-green-400 border-green-500/25',
  orange: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  red:    'bg-red-500/10 text-red-400 border-red-500/25',
  purple: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
  ghost:  'bg-bdr/60 text-muted border-bdr2',
};

const Badge = ({ children, color='blue', className='' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-sora border ${BADGE_VARIANTS[color]||BADGE_VARIANTS.blue} ${className}`}>
    {children}
  </span>
);

export default Badge; 