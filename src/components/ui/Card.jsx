const Card = ({ children, className='', hover=false, onClick }) => (
  <div
    onClick={onClick}
    className={[
      'bg-card border border-bdr rounded-2xl p-5 transition-all duration-200',
      hover ? 'hover:-translate-y-1 hover:border-bdr2 cursor-pointer' : '',
      onClick ? 'cursor-pointer' : '',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

export default Card;