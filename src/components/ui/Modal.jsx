import { useEffect } from 'react';

const Modal = ({ open, onClose, title, children, maxWidth='max-w-lg' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key==='Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}
    >
      <div className={`bg-card border border-bdr2 rounded-2xl p-8 w-full ${maxWidth} animate-fade-up`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-ghost hover:text-muted text-2xl bg-transparent border-0 leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;