import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
import { getPasswordStrength, sanitiseInput } from '../../utils/helpers';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL ;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState('register'); // 'register' | 'otp'
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [otp, setOtp]         = useState('');
  const [agreed, setAgreed]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  
  // UI State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const pwStrength = getPasswordStrength(password);

  // --- LOGIC ---
  const handleCreate = async () => {
    setError('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (!agreed) return setError('You must agree to the terms to continue.');
    
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sanitiseInput(name), email, password })
      });
      const data = await res.json();

      if (data.success) {
        setStep('otp');
        setError('');
      } else {
        setError(data.message || 'Registration failed. This email may already be in use.');
      }
    } catch (err) {
      setError('Server error. Please ensure the backend is running and try again.');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (!otp) return setError('Please enter the verification code.');

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (data.success) {
        navigate('/login'); 
      } else {
        setError(data.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setError('Server error during verification.');
    }
    setLoading(false);
  };

  // 🌟 ADDED GOOGLE LOGIN ROUTING 
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex font-sans">
      
      {/* 🌟 LEFT PANE - Fixed Spacing & Colors */}
      <div className="hidden lg:flex w-[45%] flex-col p-12 relative overflow-hidden bg-[#0B0E14] border-r border-gray-800">
        
        {/* Logo anchored to the top */}
        <div className="mb-auto z-20">
          <Logo onClick={() => navigate('/')} className="cursor-pointer" />
        </div>
        
        {/* Content anchored to the middle */}
        <div className="z-10 mb-auto mt-12">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-12">
            Master your next<br/>interview with <span className="text-blue-500">AI.</span>
          </h1>

          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">AI Mock Interviews</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Practice with industry-specific bots designed to simulate real stress and questions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="10" width="4" height="7" rx="1"/><rect x="15" y="5" width="4" height="12" rx="1"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Instant Feedback</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Get scored immediately on your body language, tone, and content quality.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Personalized Roadmap</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Tailored prep paths based on your experience and target role requirements.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Element */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* 🌟 RIGHT PANE - Fixed Vertical Centering */}
      <div className="flex-1 flex flex-col relative overflow-y-auto bg-[#0B0E14]">
        
        <div className="lg:hidden p-6 flex justify-between items-center border-b border-gray-800 shrink-0">
          <Logo onClick={() => navigate('/')} />
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-blue-400">Log in</button>
        </div>

        {/* This wrapper forces perfect vertical centering */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 min-h-screen lg:min-h-0">
          <div className="w-full max-w-[400px] animate-fade-up">
            
            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {step === 'register' ? (
              <>
                <h2 className="text-3xl font-bold text-gray-100 mb-2">Create your account</h2>
                <p className="text-sm text-gray-400 mb-8">Join thousands of candidates landing their dream jobs.</p>

                {/* 🌟 WIRED UP GOOGLE BUTTON */}
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-[#181D2A] border border-gray-700 hover:bg-[#202736] text-gray-200 rounded-xl px-4 py-3 text-sm font-semibold transition-colors mb-6 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Sign up with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-800"></div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or continue with</span>
                  <div className="flex-1 h-px bg-gray-800"></div>
                </div>

                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="w-full bg-[#141822] border border-gray-800 rounded-xl text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-[#1A1F2B]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full bg-[#141822] border border-gray-800 rounded-xl text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-[#1A1F2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={e => setPass(e.target.value)}
                        className="w-full bg-[#141822] border border-gray-800 rounded-xl text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-[#1A1F2B] pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-3">
                        <div className="flex gap-1.5 mb-1.5">
                          {[1,2,3,4].map(i => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-colors duration-300"
                              style={{ background: i <= pwStrength.score ? pwStrength.color : '#212A40' }}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Password strength: <span style={{ color: pwStrength.color }} className="font-semibold">{pwStrength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex items-start gap-3 text-xs text-gray-400 cursor-pointer mb-8">
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-[#141822] border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" 
                  />
                  <span className="leading-relaxed">
                    By signing up, you agree to our{' '}
                    <button className="text-blue-500 hover:underline bg-transparent border-0 p-0 font-medium">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-blue-500 hover:underline bg-transparent border-0 p-0 font-medium">Privacy Policy</button>.
                  </span>
                </label>

                <button 
                  onClick={handleCreate} 
                  disabled={loading || !name || !email || !password || !agreed}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg flex justify-center items-center ${
                    loading || !name || !email || !password || !agreed 
                      ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Creating...</>
                  ) : 'Create Account'}
                </button>

                <p className="text-center mt-8 text-sm text-gray-400">
                  Already have an account?{' '}
                  <button onClick={() => navigate('/login')} className="text-blue-500 font-bold bg-transparent border-0 hover:underline">Log in</button>
                </p>
              </>
            ) : (
              <div className="flex flex-col text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-white">Check your email</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  We sent a verification code to <strong className="text-gray-200">{email}</strong>.
                </p>

                <div className="mb-8">
                  <input 
                    type="text"
                    placeholder="Enter code" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className="w-full bg-[#141822] border border-gray-800 rounded-xl text-white text-center tracking-[0.5em] font-bold text-lg px-4 py-4 outline-none transition-all duration-200 focus:border-blue-500"
                    maxLength={6}
                  />
                </div>

                <button 
                  onClick={handleVerifyOTP} 
                  disabled={loading || otp.length < 4}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg flex justify-center items-center ${
                    loading || otp.length < 4 
                      ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Verifying...</>
                  ) : 'Verify Account'}
                </button>

                <button onClick={() => setStep('register')} className="mt-8 text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
                  ← Back to sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;