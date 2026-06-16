const Input = ({ label, id, type='text', placeholder, value, onChange, icon, required=false, autoComplete, className='' }) => {
  const uid = id || label?.toLowerCase().replace(/\s+/g,'-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={uid} className="text-[13px] font-medium text-txt">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ghost pointer-events-none">{icon}</span>}
        <input
          id={uid}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          className={[
            'w-full bg-card2 border border-bdr2 rounded-xl text-txt text-sm outline-none transition-[border-color] duration-200',
            'focus:border-brand-lt placeholder:text-ghost',
            icon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
          ].join(' ')}
        />
      </div>
    </div>
  );
};
export default Input;