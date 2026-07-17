import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Check, Star, Zap, Shield, Sparkles } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const PremiumPage = () => {
  const navigate = useNavigate();
  const { token, user } = useApp();
  const [billing, setBilling] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);

  const PLANS = [
    {
      id: 'free',
      name: 'Basic',
      price: '$0',
      icon: <Shield className="w-6 h-6 text-gray-400" />,
      features: ['Basic Mock Interviews', 'Community Forum Access', 'Standard Response Times'],
      color: 'gray',
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      icon: <Star className="w-6 h-6 text-brand-lt" />,
      features: ['Unlimited AI Mock Interviews', 'Advanced Resume Feedback', 'Priority Community Support', 'No Ads'],
      color: 'blue',
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$39',
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      features: ['Everything in Pro', '1-on-1 Mentor Matching', 'Custom Portfolio Reviews', 'Verified "Elite" Badge'],
      color: 'purple',
      cta: 'Upgrade to Elite',
      popular: false
    }
  ];

  // 🌟 THE PAYMENT BRIDGE (Stripe Checkout Redirect)
  const handleUpgradeClick = async (plan) => {
    if (!token) {
      alert("Please log in to upgrade.");
      return navigate('/login');
    }

    // Don't allow purchasing the free plan
    if (plan.price === '$0') return;

    const rawPrice = parseInt(plan.price.slice(1));
    const priceAmount = billing === 'annual' && rawPrice > 0 ? Math.round(rawPrice * 0.8) : rawPrice;

    setLoadingPlan(plan.id);

    try {
      const res = await fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          planName: plan.name, 
          price: priceAmount 
        })
      });

      const data = await res.json();

      if (data.success && data.url) {
        // 🚀 REDIRECT TO STRIPE HOSTED CHECKOUT
        window.location.href = data.url;
      } else {
        alert("Payment session failed: " + (data.message || "Unknown error"));
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-deep py-20 px-4 flex flex-col animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge color="purple" className="mb-4">
          <Sparkles className="w-3 h-3 inline-block mr-1" /> Supercharge Your Career
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-txt mb-6 tracking-tight leading-tight">
          Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lt to-purple-500">future</span>.
        </h1>
        <p className="text-xl text-muted leading-relaxed">
          Join thousands of candidates landing their dream jobs faster with our premium AI interview tools.
        </p>

        {/* BILLING TOGGLE */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${billing === 'monthly' ? 'text-txt' : 'text-muted'}`}>Monthly</span>
          <button 
            onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-8 bg-card2 border border-bdr rounded-full relative transition-colors focus:outline-none flex items-center px-1 cursor-pointer"
          >
            <div className={`w-6 h-6 rounded-full bg-brand-lt transition-transform shadow-md ${billing === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${billing === 'annual' ? 'text-txt' : 'text-muted'}`}>
            Annually <Badge color="green" size="sm">Save 20%</Badge>
          </span>
        </div>
      </div>
      
      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-16">
        {PLANS.map(plan => {
          const rawPrice = parseInt(plan.price.slice(1));
          const displayPrice = billing === 'annual' && rawPrice > 0 ? Math.round(rawPrice * 0.8) : rawPrice;

          return (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'border-brand-lt shadow-[0_0_40px_rgba(37,99,235,0.15)] scale-[1.02]' : 'border-bdr shadow-xl'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge color="blue" className="px-4 py-1.5 shadow-lg">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6 border-b border-bdr pb-6">
                <div className="flex items-center gap-3 mb-4">
                  {plan.icon}
                  <h3 className="text-2xl font-black text-txt">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-txt">${displayPrice}</span>
                  <span className="text-muted font-medium">/mo</span>
                </div>
                {billing === 'annual' && rawPrice > 0 && (
                  <p className="text-xs text-green-500 font-bold mt-2">Billed annually at ${displayPrice * 12}</p>
                )}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-txt font-medium">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.color === 'purple' ? 'text-purple-500' : plan.color === 'blue' ? 'text-brand-lt' : 'text-green-500'}`} /> 
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.id === 'elite' ? 'purple' : plan.popular ? 'primary' : 'secondary'}
                className="w-full py-4 text-lg font-bold"
                disabled={loadingPlan === plan.id || plan.id === 'free' || (user?.plan === plan.name)}
                onClick={() => handleUpgradeClick(plan)}
              >
                {loadingPlan === plan.id 
                  ? 'Redirecting to Stripe...' 
                  : user?.plan === plan.name 
                    ? 'Current Plan' 
                    : plan.cta}
              </Button>
            </div>
          );
        })}
      </div>

    {/* FOOTER */}
      <footer className="mt-auto pt-8 border-t border-bdr2 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-black text-txt tracking-tight">PrepMate</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/privacy')} className="bg-transparent border-0 hover:text-brand-lt transition-colors cursor-pointer">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="bg-transparent border-0 hover:text-brand-lt transition-colors cursor-pointer">Terms of Service</button>
          <button onClick={() => navigate('/contact')} className="bg-transparent border-0 hover:text-brand-lt transition-colors cursor-pointer">Contact Support</button>
        </div>
      </footer>
    </div>
  );
};

export default PremiumPage;