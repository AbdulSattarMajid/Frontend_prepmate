import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext'; // Adjust path if needed based on your folder structure

const BillingTab = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // 1. Get the current plan from the user object, default to 'Basic' if undefined
  const currentPlanName = user?.plan || 'Basic';

  // 2. Define the dynamic details for each plan to match your PremiumPage
  const planDetails = {
    'Basic': {
      price: '$0',
      desc: 'Basic Mock Interviews, Community Forum Access, and Standard Support.',
      isPaid: false,
      color: 'bg-gray-500'
    },
    'Pro': {
      price: '$19',
      desc: 'Unlimited AI Mock Interviews, Advanced Resume Feedback, and Priority Support.',
      isPaid: true,
      color: 'bg-brand'
    },
    'Elite': {
      price: '$39',
      desc: 'Everything in Pro + 1-on-1 Mentor Matching and Custom Portfolio Reviews.',
      isPaid: true,
      color: 'bg-purple-500'
    }
  };

  const planInfo = planDetails[currentPlanName] || planDetails['Basic'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Billing & Plan</h2>
      
      <div className={`bg-card2 border rounded-xl p-6 relative overflow-hidden transition-colors ${planInfo.isPaid ? 'border-brand-lt/30' : 'border-bdr2'}`}>
        
        {/* Only show the glowing background effect for paid plans */}
        {planInfo.isPaid && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        )}
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className={`inline-block px-3 py-1 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider ${planInfo.color}`}>
              Current Plan
            </span>
            <h3 className="text-2xl font-bold text-txt transition-colors">{currentPlanName} Tier</h3>
            <p className="text-muted text-sm mt-1 transition-colors">{planInfo.desc}</p>
          </div>
          <span className="text-3xl font-black text-txt transition-colors">
            {planInfo.price}<span className="text-sm text-muted font-normal">/mo</span>
          </span>
        </div>
        
        <div className="pt-6 mt-6 border-t border-bdr2 relative z-10 flex flex-wrap gap-3">
          {planInfo.isPaid ? (
            <>
              {/* For Paid Users */}
              <button className="px-5 py-2 bg-card border border-bdr text-txt text-sm font-semibold rounded-lg hover:border-brand transition-colors">
                Cancel Subscription
              </button>
              <button className="px-5 py-2 bg-brand hover:bg-brand-lt text-white text-sm font-semibold rounded-lg transition-colors">
                Update Payment Method
              </button>
            </>
          ) : (
            <>
              {/* For Free Users */}
              <button 
                onClick={() => navigate('/premium')}
                className="px-5 py-2 bg-brand hover:bg-brand-lt text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Upgrade to Premium
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingTab;