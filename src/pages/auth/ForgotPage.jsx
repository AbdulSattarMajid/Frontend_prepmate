import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getPasswordStrength } from '../../utils/helpers';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL ;

const ForgotPage = () => {
  const navigate = useNavigate();
  // We added a specific 'verify' step to the flow
  const [step, setStep]         = useState('request'); 
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [newPassword, setPass]  = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const pwStrength = getPasswordStrength(newPassword);

  // STEP 1: Ask backend to send the email
  const handleSendOTP = async () => {
    setError('');
    if (!email) return setError('Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        setStep('verify');
      } else {
        setError(data.message || 'Failed to send OTP. Check your email address.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  // STEP 2: Just validate the UI input, don't hit the backend yet!
  const handleVerifyOTP = () => {
    setError('');
    if (otp.length < 6) return setError('Please enter the full 6-digit code.');
    // Move smoothly to the password screen
    setStep('reset');
  };

  // STEP 3: Send everything to the backend at once
  const handleResetPassword = async () => {
    setError('');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters long.');

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }) 
      });
      const data = await res.json();

      if (data.success) {
        setStep('success');
      } else {
        // If the backend rejects the OTP here, kick them back to the OTP screen
        setError(data.message || 'Invalid or expired OTP code.');
        setStep('verify');
      }
    } catch (err) {
      setError('Server error while resetting password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-deep flex flex-col">
      <nav className="px-6 py-4 border-b border-bdr flex justify-between items-center">
        <Logo onClick={() => navigate('/')} />
        <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>Back to Login</Button>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="bg-card/95 border border-bdr2 rounded-2xl p-8 text-center backdrop-blur">
            <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/25 flex items-center justify-center text-3xl mx-auto mb-6">
              {step === 'success' ? '✅' : '🔑'}
            </div>
            
            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 text-left">
                {error}
              </div>
            )}

            {/* --- STEP 1: EMAIL REQUEST --- */}
            {step === 'request' && (
              <>
                <h2 className="text-2xl font-black mb-3">Forgot password?</h2>
                <p className="text-muted mb-8 leading-relaxed text-sm">Enter the email associated with your account and we'll send you an OTP.</p>
                <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} className="text-left mb-5" />
                <Button size="lg" fullWidth onClick={handleSendOTP} disabled={loading || !email}>
                  {loading ? '⏳ Sending...' : 'Send OTP →'}
                </Button>
                <button onClick={() => navigate('/login')} className="mt-5 text-sm text-muted hover:text-txt bg-transparent border-0">← Back to Login</button>
              </>
            )}

            {/* --- STEP 2: OTP VERIFICATION --- */}
            {step === 'verify' && (
              <>
                <h2 className="text-2xl font-black mb-3">Check your email</h2>
                <p className="text-muted mb-6 leading-relaxed text-sm">We sent a 6-digit code to <strong className="text-txt">{email}</strong>.</p>
                
                <div className="mb-8">
                  <Input 
                    placeholder="Enter 6-digit code" 
                    value={otp} 
                    onChange={setOtp} 
                    className="text-center tracking-[0.5em] font-sora font-bold text-lg"
                    maxLength={6}
                  />
                </div>

                <Button size="lg" fullWidth onClick={handleVerifyOTP} disabled={!otp || otp.length < 6}>
                  Verify Code →
                </Button>
                <button onClick={() => setStep('request')} className="mt-5 text-sm text-muted hover:text-txt bg-transparent border-0">← Use a different email</button>
              </>
            )}

            {/* --- STEP 3: NEW PASSWORD --- */}
            {step === 'reset' && (
              <>
                <h2 className="text-2xl font-black mb-3">Create new password</h2>
                <p className="text-muted mb-6 leading-relaxed text-sm">Please choose a strong password to secure your account.</p>

                <div className="flex flex-col gap-1.5 mb-8 text-left">
                  <label className="text-[13px] font-medium text-txt">New Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={e => setPass(e.target.value)}
                    className="w-full bg-card2 border border-bdr2 rounded-xl text-txt text-sm px-4 py-3 outline-none transition-[border-color] duration-200 focus:border-brand-lt"
                  />
                  {newPassword && (
                    <div>
                      <div className="flex gap-1 mt-2">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                            style={{ background: i<=pwStrength.score ? pwStrength.color : '#30363d' }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                    </div>
                  )}
                </div>

                <Button size="lg" fullWidth onClick={handleResetPassword} disabled={loading || newPassword.length < 8}>
                  {loading ? '⏳ Updating...' : 'Update Password'}
                </Button>
                <button onClick={() => setStep('verify')} className="mt-5 text-sm text-muted hover:text-txt bg-transparent border-0">← Back</button>
              </>
            )}

            {/* --- STEP 4: SUCCESS --- */}
            {step === 'success' && (
              <>
                <h2 className="text-2xl font-black mb-3">Password Updated!</h2>
                <p className="text-muted mb-8 leading-relaxed text-sm">Your password has been successfully reset. You can now log in to the dashboard.</p>
                <Button fullWidth onClick={() => navigate('/login')}>Go to Login</Button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPage;