import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import { CheckCircle, Sparkles, ArrowRight, Loader } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, setUser } = useApp();
  
  const [status, setStatus] = useState('verifying'); 

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId || !token) {
        setStatus('error');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/payments/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId })
        });

        const data = await res.json();

        if (data.success) {
          // 🌟 THE MAGIC: Update plan AND token balances simultaneously!
          setUser(prev => ({ 
            ...prev, 
            plan: data.plan || 'Pro',
            tokens: data.tokens !== undefined ? data.tokens : prev.tokens,
            maxTokens: data.maxTokens !== undefined ? data.maxTokens : prev.maxTokens
          }));
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus('error');
      }
    };

    verifyPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token]);

  return (
    <div className="min-h-screen bg-deep flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      
      {status === 'verifying' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-card rounded-3xl border border-bdr flex items-center justify-center shadow-xl animate-pulse">
            <Loader className="w-10 h-10 text-brand-lt animate-spin" />
          </div>
          <h2 className="text-3xl font-black text-txt">Verifying Payment...</h2>
          <p className="text-muted">Please hold on while we securely confirm your transaction with Stripe.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center space-y-6 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 bg-green-500/10 border-2 border-green-500/50 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
          
          <h2 className="text-4xl font-black text-txt tracking-tight">Payment Successful!</h2>
          <p className="text-lg text-muted leading-relaxed">
            Welcome to the premium club. Your account has been instantly upgraded. All exclusive AI tools and community features are now unlocked.
          </p>
          
          <div className="pt-6 w-full">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
            >
              Go to your Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center space-y-6 max-w-lg">
          <div className="w-24 h-24 bg-red-500/10 border-2 border-red-500/50 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-black text-txt">Something went wrong</h2>
          <p className="text-muted">We couldn't automatically verify your session. If your card was charged, please contact support and we will upgrade you manually.</p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      )}

    </div>
  );
};

export default PaymentSuccessPage;