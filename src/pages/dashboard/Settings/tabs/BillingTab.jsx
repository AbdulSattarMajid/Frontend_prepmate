const BillingTab = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Billing & Plan</h2>
      
      <div className="bg-card2 border border-brand-lt/30 rounded-xl p-6 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className="inline-block px-3 py-1 bg-brand text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              Current Plan
            </span>
            <h3 className="text-2xl font-bold text-txt transition-colors">Pro Tier</h3>
            <p className="text-muted text-sm mt-1 transition-colors">Unlimited mock interviews and advanced ATS grading.</p>
          </div>
          <span className="text-3xl font-black text-txt transition-colors">$15<span className="text-sm text-muted font-normal">/mo</span></span>
        </div>
        
        <div className="pt-6 mt-6 border-t border-brand/20 relative z-10 flex gap-3">
          <button className="px-5 py-2 bg-card border border-bdr text-txt text-sm font-semibold rounded-lg hover:border-brand transition-colors">
            Cancel Subscription
          </button>
          <button className="px-5 py-2 bg-brand hover:bg-brand-lt text-white text-sm font-semibold rounded-lg transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;