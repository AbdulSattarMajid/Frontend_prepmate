import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-deep py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-card border border-bdr rounded-2xl p-8 md:p-12 shadow-xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-muted hover:text-brand-lt transition-colors mb-8 bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl md:text-4xl font-black text-txt mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="space-y-6 text-muted leading-relaxed">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <h2 className="text-xl font-bold text-txt mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using PrepMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">2. Description of Service</h2>
          <p>PrepMate provides AI-powered interview preparation tools, including resume parsing, automated mock interviews, and community forums. While our AI strives for accuracy in ATS scoring and feedback, it is meant as a preparation tool and does not guarantee job placement or real-world interview success.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">3. User Conduct & Community Guidelines</h2>
          <p>When participating in the PrepMate community forums, you agree to treat others with respect. Harassment, spam, or the sharing of inappropriate content will result in immediate account termination. We reserve the right to remove any post that violates these guidelines.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">4. Subscriptions and Refunds</h2>
          <p>Premium tiers are billed on a recurring monthly or annual basis. You may cancel your subscription at any time through your billing dashboard. Cancellations will take effect at the end of your current billing cycle. We do not offer prorated refunds for mid-cycle cancellations.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;