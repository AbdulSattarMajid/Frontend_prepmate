import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button'; // Adjust path if needed
import { Mail, MessageSquare, ArrowLeft, Send } from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate a successful send.
    // Later, you can wire this to an Express route like POST /api/support/contact
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-deep py-20 px-4 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-3xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-muted hover:text-brand-lt transition-colors mb-8 bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-txt mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-muted">Have a question about our premium plans or need technical help? We're here for you.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="space-y-6 md:col-span-1">
            <div className="bg-card border border-bdr rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
              <div className="w-12 h-12 bg-brand/10 text-brand-lt rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-txt mb-1">Email Us</h3>
              <p className="text-sm text-muted">support@prepmate.com</p>
            </div>
            
            <div className="bg-card border border-bdr rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-txt mb-1">Live Chat</h3>
              <p className="text-sm text-muted">Available in your dashboard for registered users.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-bdr rounded-2xl p-8 md:col-span-2 shadow-xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-txt">Message Sent!</h3>
                <p className="text-muted">Thanks for reaching out. Our support team will get back to you within 24 hours.</p>
                <Button onClick={() => navigate('/')} variant="secondary" className="mt-4">Return Home</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-4 py-3 text-txt focus:outline-none focus:border-brand transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-4 py-3 text-txt focus:outline-none focus:border-brand transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted">How can we help?</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-4 py-3 text-txt focus:outline-none focus:border-brand transition-colors resize-none"
                    placeholder="Tell us about your issue..."
                  />
                </div>
                <Button type="submit" className="w-full py-3 mt-2 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;