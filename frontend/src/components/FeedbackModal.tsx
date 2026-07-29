import React, { useState } from 'react';
import { submitUserFeedback } from '../utils/api';
import { logEvent } from '../utils/analytics';
import { Star, MessageSquare, Check, X, User } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  userAddress: string | null;
  onClose: () => void;
  onFeedbackSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  userAddress,
  onClose,
  onFeedbackSubmitted,
}) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      userName: userName || 'Anonymous User',
      userAddress: userAddress || 'Anonymous',
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    // 1. Submit to Google Sheets Database Endpoint
    const success = await submitUserFeedback(payload);

    // 2. Log local analytics event
    logEvent('user_feedback_submitted', payload);

    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1500);
    } else {
      alert('Failed to record feedback to Google Sheet database. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="relative bg-slate-900 border border-slate-800/90 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Share Feedback</h3>
              <p className="text-xs text-slate-400">Recorded on Google Sheets Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Thank You!</h4>
            <p className="text-xs text-slate-400">
              Your feedback has been saved permanently to the project database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User Name Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Your Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Earth Kumar"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Interactive Star Rating Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-2">
                Rating Assessment
              </label>
              <div className="flex items-center space-x-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform duration-150 hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700 fill-slate-800'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Comments & Suggestions *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience using StellarFlow smart contract execution..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/25"
              >
                {isSubmitting ? 'Recording...' : 'Submit Feedback'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};