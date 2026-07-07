import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';
import { 
  BarChart, 
  FileText, 
  Database, 
  Upload, 
  Mic, 
  TrendingUp, 
  Target, 
  Rocket, 
  Star, 
  Play, 
  User,
  X // <-- Added X icon for the close button
} from 'lucide-react';

// 👇 Replace 'demo.mp4' with your actual video filename in the folder
import demoVideo from './FYP_Reel.mp4'; 

const FEATURES = [
  { icon: <BarChart className="w-8 h-8 text-brand-lt" />, title: 'Real-time Feedback',  desc: 'Get instant scoring on tone, pace, and keywords during practice. Our AI detects filler words and suggests improvements on the fly.' },
  { icon: <FileText className="w-8 h-8 text-brand-lt" />, title: 'Resume Analysis',     desc: 'Ensure your CV passes ATS filters. We scan your resume against job descriptions to highlight key strengths and missing keywords.' },
  { icon: <Database className="w-8 h-8 text-brand-lt" />, title: 'Massive Question Bank', desc: 'Practice with 500+ industry-specific questions tailored to your target role — from behavioral deep-dives to system design marathons.' },
];

const STATS = [
  { v: '10k+', l: 'Interviews Conducted' },
  { v: '95%',  l: 'Success Rate' },
  { v: '500+', l: 'Companies Hiring' },
  { v: '24/7', l: 'AI Availability' }
];

const STEPS = [
  { n: 1, icon: <Upload className="w-6 h-6 text-white" />, title: 'Upload Your Details', desc: 'Drop your resume and paste the job description you\'re targeting.' },
  { n: 2, icon: <Mic className="w-6 h-6 text-white" />, title: 'Run a Mock Interview',  desc: 'Answer AI-generated questions in a realistic simulation with live coaching.' },
  { n: 3, icon: <TrendingUp className="w-6 h-6 text-white" />, title: 'Get Actionable Feedback', desc: 'Receive detailed analytics on your performance and a personalised improvement plan.' },
];

const TESTIMONIALS = [
  { 
    name: 'Sufyan Tipu', 
    role: 'PM at Spotify', 
    text: 'PrepMate caught that I was speaking too fast when nervous. Real-time feedback was a game changer for my final rounds.', 
    stars: 5 
  },
  { 
    name: 'Muhammad Uzair', 
    role: 'SWE at Google', 
    text: 'The technical question bank is scary accurate. I was asked three questions from my PrepMate sessions in the actual interview!', 
    stars: 5 
  },
  { 
    name: 'Anonymous', 
    role: 'UX Designer at Airbnb', 
    text: 'I struggled with behavioural questions. The STAR coaching built into PrepMate made my answers dramatically more structured.', 
    stars: 5 
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  // 👇 Added state to control video modal visibility
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <Badge color="blue" className="mb-5">AI-Powered Career Coach</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            Ace Your Next<br/>Interview with<br/><span className="text-brand-lt">Confidence</span>
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-md mb-8">
            PrepMate analyses your resume and runs realistic mock interviews to give you personalised, actionable feedback — instantly.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" onClick={() => navigate('/signup')}>Get Started Free</Button>
            {/* 👇 Added onClick to trigger the video modal */}
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex items-center gap-2"
              onClick={() => setShowVideoModal(true)}
            >
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </Button>
          </div>
          <div className="flex items-center gap-3 text-ghost text-sm">
            <div className="flex">
              {[1, 2, 3].map((_, i) => (
                <div 
                  key={i} 
                  className="w-7 h-7 rounded-full bg-card2 border-2 border-deep flex items-center justify-center bg-gray-100 text-gray-500" 
                  style={{ marginLeft: i ? -10 : 0, zIndex: 10 - i }}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
              ))}
            </div>
            Join 10,000+ candidates hired this year
          </div>
        </div>

        {/* Hero card with Background Image */}
        <div className="relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative bg-card rounded-2xl border border-bdr overflow-hidden aspect-[4/3] flex items-center justify-center shadow-2xl">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" 
              alt="Professional Interview Environment" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand/40" />
            
            {/* Foreground Content */}
            <div className="text-center px-10 relative z-10">
              <Target className="w-16 h-16 mx-auto mb-4 text-brand-lt" />
              <p className="font-sora text-xl font-bold mb-2 text-white">AI Interview Session</p>
              <p className="text-gray-300 text-sm">Live feedback in real-time</p>
            </div>

            {/* Floating Live Analysis Badge */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 z-10 shadow-lg">
              <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wide">Live Analysis</p>
              <p className="text-sm font-bold text-white">
                Speaking Pace: <span className="text-green-400">Perfect (140 wpm)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-bdr py-8 px-4 text-center">
        <p className="text-[11px] text-ghost tracking-[3px] uppercase mb-5">Trusted by candidates who landed roles at</p>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
          {['Google', 'Amazon', 'Microsoft', 'Spotify', 'Netflix'].map(c => (
            <span key={c} className="font-sora font-bold text-ghost text-lg tracking-tight">{c}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Why Choose PrepMate?</h2>
          <p className="text-muted max-w-md mx-auto leading-relaxed">Our AI-driven platform provides everything you need to prepare confidently and stand out.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Card key={f.title} hover className="p-7">
              <div className="mb-5">{f.icon}</div>
              <h3 className="font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-brand/8 to-brand/3 border-y border-bdr py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <p className="text-5xl font-black font-sora text-brand-lt mb-2">{s.v}</p>
              <p className="text-muted text-sm">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">Your path to hired in 3 steps</h2>
        <p className="text-muted mb-16">Simple, effective, and designed to get you results fast.</p>
        <div className="grid sm:grid-cols-3 gap-12 relative">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-lt flex items-center justify-center mb-5 shadow-[0_0_32px_rgba(37,99,235,0.35)]">
                {s.icon}
              </div>
              <h3 className="font-bold text-base mb-3">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-y border-bdr py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-14">What Our Users Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-7 flex flex-col gap-5 text-center items-center">
                <div className="flex gap-1 text-amber-400 justify-center">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-muted text-sm leading-relaxed flex-1">"{t.text}"</p>
                
                <div className="pt-2 border-t border-bdr2/50 mt-auto flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-card2 border border-bdr flex items-center justify-center text-ghost">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-txt">{t.name}</p>
                    <p className="text-xs text-ghost">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-lt flex items-center justify-center text-white mx-auto mb-7 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
          <Rocket className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black mb-5">Ready to ace your interview?</h2>
        <p className="text-muted mb-10 leading-relaxed">Join thousands of job seekers who transformed their interview game with PrepMate's AI coaching.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/signup')}>Start for Free</Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/premium')}>View Pricing</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bdr bg-card py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo onClick={() => {}} />
          <div className="flex flex-wrap gap-6 text-xs text-ghost">
            {['About', 'Features', 'Community', 'Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
              <button key={l} className="bg-transparent border-0 text-ghost hover:text-muted transition-colors duration-150">{l}</button>
            ))}
          </div>
          <p className="text-xs text-ghost">© 2026 PrepMate, Inc.</p>
        </div>
      </footer>

      {/* 👇 VIDEO MODAL COMPONENT */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowVideoModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-bdr z-10 animate-fade-up">
            {/* Close Button */}
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <video 
              src={demoVideo} 
              controls 
              autoPlay 
              className="w-full h-auto max-h-[85vh] object-contain outline-none"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;