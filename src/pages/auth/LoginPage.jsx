import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../../components/ui/Logo';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  
  // UI State for password visibility (matching the new Signup page)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        // Pass temporary user data; the AppContext will instantly fetch the full profile using the token
        login({ email }, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Server error. Please ensure the backend is running and try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Redirect browser directly to the backend Google Auth endpoint
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex font-sans">
      
      {/* LEFT PANE - Marketing/Value Prop (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] flex-col p-12 relative overflow-hidden bg-[#0B0E14] border-r border-gray-800">
        
        {/* Logo anchored to the top */}
        <div className="mb-auto z-20">
          <Logo onClick={() => navigate('/')} className="cursor-pointer" />
        </div>
        
        {/* Content anchored to the middle */}
        <div className="z-10 mb-auto mt-12">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-12">
            Welcome back to your<br/>prep <span className="text-blue-500">ecosystem.</span>
          </h1>

          <div className="space-y-6 max-w-md">
            {/* Feature 1: Resume */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">ATS Resume Analyzer</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Optimize your CV with real-time keyword matching, experience tracking, and grammar checks.</p>
              </div>
            </div>

            {/* Feature 2: Learning Module */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Targeted Knowledge Quizzes</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Sharpen your technical skills with role-specific MCQs, instant scoring, and detailed answer reviews.</p>
              </div>
            </div>

            {/* Feature 3: Community */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A29] border border-gray-800 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Exclusive Tech Community</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Share experiences, ask questions, and learn from a network of driven candidates and industry peers.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Element */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* RIGHT PANE - Form Section */}
      <div className="flex-1 flex flex-col relative overflow-y-auto bg-[#0B0E14]">
        
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex justify-between items-center border-b border-gray-800 shrink-0">
          <Logo onClick={() => navigate('/')} />
          <button onClick={() => navigate('/signup')} className="text-sm font-semibold text-blue-400">Sign up</button>
        </div>

        {/* This wrapper forces perfect vertical centering */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 min-h-screen lg:min-h-0">
          <div className="w-full max-w-[400px] animate-fade-up">
            
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-400 mb-8">Sign in to continue to your PrepMate dashboard.</p>

            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {/* Google Auth Button */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#181D2A] border border-gray-700 hover:bg-[#202736] text-gray-200 rounded-xl px-4 py-3 text-sm font-semibold transition-colors mb-6 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-800"></div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-1 h-px bg-gray-800"></div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  autoComplete="email"
                  className="w-full bg-[#141822] border border-gray-800 rounded-xl text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-[#1A1F2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPass(e.target.value)}
                    required
                    autoComplete="current-password"
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
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => navigate('/forgot')} 
                className="text-xs font-semibold text-blue-500 hover:underline bg-transparent border-0"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              disabled={loading || !email || !password}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg flex justify-center items-center ${
                loading || !email || !password 
                  ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Signing in...</>
              ) : 'Sign In'}
            </button>

            <p className="text-center mt-8 text-sm text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-blue-500 font-bold bg-transparent border-0 hover:underline">Sign up free</button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;