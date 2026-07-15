import { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Star, Loader2, Check } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const SupportTab = () => {
  const { token } = useApp();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle');

  const handleReviewSubmit = async () => {
    if (!rating) {
      alert("Please select a star rating first.");
      return;
    }

    setReviewStatus('submitting');
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, feedback: reviewText })
      });

      const result = await res.json();

      if (res.ok) {
        setReviewStatus('success');
        setRating(0);
        setReviewText('');
        setTimeout(() => setReviewStatus('idle'), 4000);
      } else {
        alert(result.message || "Failed to submit review.");
        setReviewStatus('idle');
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      alert("A network error occurred.");
      setReviewStatus('idle');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-2 transition-colors">Help & Support</h2>
      <p className="text-sm text-muted mb-6 transition-colors">We value your feedback. Rate your experience and let us know how we can improve.</p>
      
      <div className="bg-card2 border border-bdr rounded-xl p-6 transition-colors text-center">
        <h3 className="text-lg font-bold text-txt mb-4 transition-colors">How is your PrepMate experience?</h3>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={36} 
                className={`${
                  star <= (hoverRating || rating) 
                    ? 'fill-brand text-brand' 
                    : 'text-bdr2'
                } transition-colors duration-200`} 
              />
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          placeholder="Tell us what you love or what we could do better... (Optional)"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full bg-card border border-bdr rounded-lg px-4 py-3 text-txt text-sm focus:outline-none focus:border-brand transition-colors resize-none mb-4"
        />

        <button 
          onClick={handleReviewSubmit}
          disabled={reviewStatus === 'submitting' || rating === 0}
          className="w-full sm:w-auto px-8 py-2.5 bg-brand hover:bg-brand-lt text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {reviewStatus === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : 'Submit Review'}
        </button>

        {reviewStatus === 'success' && (
          <p className="text-green-500 text-sm font-semibold mt-4 animate-fade-in-up flex items-center justify-center gap-1">
            <Check size={16} /> Thank you for your feedback!
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-bdr flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-muted">Need technical support?</span>
        <a href="mailto:support@prepmate.com" className="text-sm font-bold text-brand hover:underline">
          Contact Support Team
        </a>
      </div>
    </div>
  );
};

export default SupportTab;