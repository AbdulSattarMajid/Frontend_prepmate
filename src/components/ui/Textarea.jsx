const Textarea = ({ label, id, placeholder, value, onChange, rows=4, className='' }) => {
  const uid = id || label?.toLowerCase().replace(/\s+/g,'-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={uid} className="text-[13px] font-medium text-txt">{label}</label>}
      <textarea
        id={uid}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-card2 border border-bdr2 rounded-xl text-txt text-sm px-4 py-3 outline-none resize-vertical transition-[border-color] duration-200 focus:border-brand-lt placeholder:text-ghost"
      />
    </div>
  );
};
export default Textarea;