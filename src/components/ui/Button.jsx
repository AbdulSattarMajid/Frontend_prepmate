const VARIANT_CLASSES = {
  primary: 'bg-gradient-to-br from-brand to-brand-lt text-white shadow-[0_0_22px_rgba(37,99,235,0.32)] hover:opacity-90',
  secondary:'bg-card2 text-txt border border-bdr2 hover:border-brand-lt/50',
  ghost:   'bg-transparent text-muted border border-bdr hover:text-txt hover:border-bdr2',
  danger:  'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
  outline: 'bg-transparent text-brand-lt border border-brand-lt hover:bg-brand-lt/10',
  purple:  'bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-[0_0_22px_rgba(139,92,246,0.3)] hover:opacity-90',
};
const SIZE_CLASSES = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-[15px] gap-2.5',
};

const Button = ({ children, variant='primary', size='md', onClick, disabled=false, className='', type='button', fullWidth=false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={[
      'inline-flex items-center justify-center font-sora font-semibold rounded-xl border-0 transition-all duration-200 select-none',
      VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
      SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
      disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
  >
    {children}
  </button>
);
export default Button;