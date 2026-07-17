import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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

        <h1 className="text-3xl md:text-4xl font-black text-txt mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted leading-relaxed">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <h2 className="text-xl font-bold text-txt mt-8 mb-4">1. Information We Collect</h2>
          <p>When you use PrepMate, we collect information you provide directly to us, including your name, email address, and profile details. For our core services, we also securely process your uploaded resumes and audio/video input during AI mock interviews.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">2. How We Use Your AI Data</h2>
          <p>The resumes you upload and the responses you provide during mock interviews are processed by our backend Python AI engines strictly to provide ATS scoring and interview feedback. We do not sell your personal data or use your private interview sessions to train public AI models.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">3. Payment Processing</h2>
          <p>All premium subscription payments are processed securely through Stripe. PrepMate does not store or have direct access to your credit card numbers or sensitive financial data.</p>

          <h2 className="text-xl font-bold text-txt mt-8 mb-4">4. Account Deletion</h2>
          <p>You have the right to request the deletion of your account and all associated data at any time via your dashboard settings. Upon deletion, your resumes, interview history, and forum posts will be permanently removed from our active databases.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;