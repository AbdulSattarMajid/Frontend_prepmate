const Logo = ({ size = 28, onClick }) => (
  <button
    onClick={onClick}
    aria-label="PrepMate home"
    className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer"
  >
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ width:size, height:size, background:'linear-gradient(135deg,#2563eb,#60a5fa)' }}
    >
      <svg width={size*0.56} height={size*0.56} viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
    <span className="font-sora font-bold text-txt" style={{ fontSize:size*0.64 }}>PrepMate</span>
  </button>
);

export default Logo;
