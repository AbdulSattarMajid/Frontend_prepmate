import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext'; // 🌟 Required for token
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PLANS } from '../../data/mockData';

const BASE_URL = 'https://prepmate-auth-module.onrender.com';

const PremiumPage = () => {
  const navigate = useNavigate();
  const { token, user } = useApp(); // 🌟 Get token and user
  const [billing, setBilling] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null); // 🌟 To show loading state on buttons

  // 🌟 THE PAYMENT BRIDGE
  const handleUpgradeClick = async (plan) => {
    if (!token) {
      alert("Please log in to upgrade.");
      return navigate('/login');
    }

    // Calculate price based on toggle
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
        // 🚀 REDIRECT TO STRIPE
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
    <div className="min-h-screen py-20 px-4 flex flex-col">
      {/* ... (Keep your Header and Billing Toggle exactly as is) ... */}
      
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative bg-card border rounded-2xl p-8 flex flex-col transition-all duration-200 ${plan.popular ? 'border-brand-lt shadow-[0_0_40px_rgba(37,99,235,0.2)] -translate-y-2' : 'border-bdr'}`}
          >
            {/* ... (Keep your Popular Badge and Header content) ... */}
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>

            {/* 🌟 UPDATED BUTTON LOGIC */}
            <Button
              variant={plan.id==='elite' ? 'purple' : plan.popular ? 'primary' : 'ghost'}
              fullWidth
              disabled={loadingPlan === plan.id || plan.price === '$0'}
              onClick={() => handleUpgradeClick(plan)}
            >
              {loadingPlan === plan.id ? 'Redirecting...' : plan.cta}
            </Button>
          </div>
        ))}
      </div>

        <footer className="mt-24 pt-8 border-t border-bdr2 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="font-black text-txt tracking-tight">PrepMate</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-lt transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-lt transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-lt transition-colors">Contact Support</a>
          </div>
        </footer>    </div>
  );
};
export default PremiumPage;