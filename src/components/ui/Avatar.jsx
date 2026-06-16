import { initials } from '../../utils/helpers';
const Avatar = ({ name='', size=36, emoji, className='' }) => (
  <div
    aria-label={name}
    className={`rounded-full flex-shrink-0 flex items-center justify-center font-sora font-bold text-white select-none ${className}`}
    style={{ width:size, height:size, fontSize:size*0.36, background:'linear-gradient(135deg,#2563eb,#60a5fa)' }}
  >
    {emoji || initials(name) || '?'}
  </div>
);
export default Avatar;