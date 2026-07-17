import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Mic, FileText, Brain } from 'lucide-react';
// import Navbar from '../components/layout/Navbar'; 
// import Button from '../components/ui/Button'; 

const FAQ_DATA = [
  {
    category: "General",
    icon: HelpCircle,
    faqs: [
      {
        q: "What exactly is PrepMate?",
        a: "PrepMate is an all-in-one, AI-powered interview preparation ecosystem. We combine intelligent ATS resume grading, dynamic mock interviews with real-time feedback, and targeted technical quizzes to help you land your dream job faster."
      },
      {
        q: "Is PrepMate free to use?",
        a: "Yes! We offer a generous free tier that includes access to our community forum, basic resume analysis, and limited mock interviews. For unlimited AI interviews and advanced ATS keyword targeting, we offer premium plans."
      },
      {
        q: "Do I need to download any software?",
        a: "No, PrepMate is entirely browser-based. Our AI mock interviews and resume analyzer work flawlessly on any modern web browser (Chrome, Safari, Edge, Firefox) on both desktop and mobile devices."
      }
    ]
  },
  {
    category: "Mock Interviews",
    icon: Mic,
    faqs: [
      {
        q: "How does the AI Mock Interview work?",
        a: "You select your target role (e.g., Frontend Developer), and our AI generates behavioral and technical questions tailored to that job. You answer using your microphone or camera, and the AI analyzes your tone, pacing, and content to provide an instant score and feedback."
      },
      {
        q: "Are the interview questions the same every time?",
        a: "Not at all. Our AI generates dynamic, randomized questions based on the specific job description and role you select. No two interview sessions will be exactly alike, ensuring you are prepared for anything."
      },
      {
        q: "Who reviews my interview recordings?",
        a: "Your privacy is our priority. Your audio and video data are processed securely by our AI engine for real-time grading and are never shared with third parties or human reviewers without your explicit consent."
      }
    ]
  },
  {
    category: "Resume Analyzer",
    icon: FileText,
    faqs: [
      {
        q: "What file formats does the Resume Analyzer support?",
        a: "Currently, our ATS engine supports both .PDF and .DOCX formats. We highly recommend using PDFs to ensure your formatting remains perfectly intact during the scan."
      },
      {
        q: "How does the ATS scoring system work?",
        a: "Our backend algorithm cross-references the text in your resume against the Job Description you paste. It calculates a match percentage based on missing keywords, total years of experience, and grammatical accuracy."
      },
      {
        q: "Can I download my resume analysis report?",
        a: "Yes! Once the AI finishes grading your resume, you can click the 'Download PDF' button to save a detailed report of your matched skills, missing keywords, and grammar suggestions."
      }
    ]
  },
  {
    category: "Quizzes",
    icon: Brain,
    faqs: [
      {
        q: "What topics are covered in the Knowledge Quizzes?",
        a: "We currently offer targeted MCQs for Frontend, Backend, Fullstack, DevOps, Data Science, AI Engineering, Cyber Security, QA, and general Data Structures & Algorithms (DSA)."
      },
      {
        q: "Can I customize the length of the quiz?",
        a: "Yes! Before starting a module, you can select your topic and choose anywhere from 1 to 50 questions per session. At the end, you'll receive a detailed breakdown of correct and incorrect answers."
      }
    ]
  }
];

const FAQPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(FAQ_DATA[0].category);
  const [openIndex, setOpenIndex] = useState(0);

  const activeCategoryData = FAQ_DATA.find(data => data.category === activeTab);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-deep text-txt font-sans relative overflow-hidden selection:bg-brand-lt/30 transition-colors duration-300">
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-lt/15 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand/10 blur-[150px] pointer-events-none rounded-full" />

      <main className="relative z-10 animate-fade-in-up pb-24">
        
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lt/10 border border-brand-lt/20 text-brand-lt text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lt opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lt"></span>
            </span>
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-txt tracking-tight mb-6 transition-colors duration-300">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lt to-brand">help you?</span>
          </h1>
          <p className="text-muted text-lg md:text-xl leading-relaxed transition-colors duration-300">
            Everything you need to know about the PrepMate platform, billing, and mastering your next interview.
          </p>
        </div>

        {/* Horizontal Category Navigation (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 px-6 mb-16 max-w-4xl mx-auto">
          {FAQ_DATA.map((tab) => {
            const isActive = activeTab === tab.category;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.category}
                onClick={() => {
                  setActiveTab(tab.category);
                  setOpenIndex(0);
                }}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-medium transition-all duration-300 border ${
                  isActive 
                    ? 'bg-brand border-brand-lt text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] scale-105' 
                    : 'bg-card/60 border-bdr/80 text-muted hover:bg-card hover:text-txt hover:border-bdr2'
                }`}
              >
                <TabIcon size={18} strokeWidth={2} />
                {tab.category}
              </button>
            );
          })}
        </div>

        {/* Focused FAQ Content Column */}
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="space-y-4">
            {activeCategoryData.faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div 
                  key={index} 
                  className={`group bg-card/40 backdrop-blur-md border transition-all duration-300 rounded-2xl overflow-hidden ${
                    isOpen ? 'border-brand-lt/50 shadow-[0_8px_30px_-12px_rgba(59,130,246,0.2)] bg-card/80' : 'border-bdr/60 hover:border-bdr hover:bg-card/60'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left bg-transparent cursor-pointer border-0"
                  >
                    <span className={`font-semibold pr-6 text-lg transition-colors duration-200 ${isOpen ? 'text-txt' : 'text-muted group-hover:text-txt'}`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? 'bg-brand text-white rotate-180 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]' : 'bg-deep text-muted group-hover:text-txt'
                    }`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </button>
                  
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-7 text-muted leading-relaxed text-base pt-2">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="max-w-3xl mx-auto px-6 mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-deep border border-bdr/80 p-8 md:p-12 text-center group">
            {/* Hover flare effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-lt/0 via-brand-lt/10 to-brand-lt/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-lt/10 flex items-center justify-center mb-6 border border-brand-lt/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-brand-lt" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-txt mb-3">Still have questions?</h3>
              <p className="text-muted mb-8 max-w-md mx-auto text-lg">
                Can't find the answer you're looking for? Chat with our friendly team. We're here to help you succeed.
              </p>
              
              {/* 🌟 ADDED THE ONCLICK NAVIGATE HERE */}
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-4 border-0 cursor-pointer bg-txt text-deep font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.6)] hover:-translate-y-1 hover:opacity-90"
              >
                Contact Support
              </button>
              
            </div>
          </div>
        </div>  

      </main>
    </div>
  );
};

export default FAQPage;