const sanitiseInput = (str = '') =>
  str.replace(/[<>'"&]/g, c => ({'<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;','&':'&amp;'}[c]));

const getPasswordStrength = (pw) => {
  if (!pw) return { score:0, label:'', color:'' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label:'Too short', color:'#f85149' },
    { label:'Weak',      color:'#f85149' },
    { label:'Fair',      color:'#d29922' },
    { label:'Good',      color:'#3fb950' },
    { label:'Strong',    color:'#3fb950' },
  ];
  return { score, ...map[score] };
};

const initials = (name='') =>
  name.trim().split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('');

export { sanitiseInput, getPasswordStrength, initials };