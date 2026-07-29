import React, { useState, useEffect, useCallback } from 'react';
import { STELLAR_CONFIG } from '../config/stellar';
import { Star, MessageSquare, Send, CheckCircle2, RefreshCw } from 'lucide-react';

interface FeedbackItem {
  timestamp: string;
  userName: string;
  userAddress: string;
  targetAddress: string;
  rating: number;
  category: string;
  comment: string;
}

interface FeedbackPageProps {
  publicKey: string | null;
  escrow?: any;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ publicKey, escrow }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Freelancer Work Quality');
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const freelancerAddress = escrow?.freelancer || '';
  const isClient = publicKey && escrow ? publicKey === escrow.client : true;

  // Fetch Public Reviews from Apps Script backend
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${STELLAR_CONFIG.appsScriptUrl}?action=get_feedback`);
      const data = await res.json();
      if (data && Array.isArray(data.feedback)) {
        setReviews(data.feedback);
      }
    } catch (err) {
      console.warn('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit Client -> Freelancer review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    const payload = {
      action: 'log_feedback',
      timestamp: new Date().toISOString(),
      userName: userName || (isClient ? 'Client' : 'User'),
      userAddress: publicKey || 'Not Connected',
      targetAddress: freelancerAddress || 'General',
      rating,
      category,
      comment,
    };

    try {
      await fetch(STELLAR_CONFIG.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      setSuccessMessage('Freelancer review submitted to audit database!');
      setComment('');
      fetchReviews();
    } catch (err) {
      console.error('Submit feedback failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (addr: string) =>
    addr && addr.length > 10 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
            <span>Client → Freelancer Feedback</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Rate freelancer performance, milestone delivery, and code quality on the Soroban audit ledger
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition border border-slate-700/80 flex items-center space-x-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Feed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Client Feedback Form */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Send className="w-5 h-5 text-indigo-400" />
            <span>Review Freelancer</span>
          </h2>

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            
            {/* Client Name */}
            <div>
              <label className="text-slate-400 block mb-1">Your Client Name</label>
              <input
                type="text"
                placeholder="e.g. Alice (Client)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Target Freelancer Wallet Address */}
            <div>
              <label className="text-slate-400 block mb-1">Target Freelancer Wallet</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 font-bold truncate">
                {freelancerAddress ? formatAddress(freelancerAddress) : 'No active escrow contract selected'}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <label className="text-slate-400 block mb-1">Evaluation Criteria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Freelancer Work Quality">Work Quality & Deliverables</option>
                <option value="Deadline Adherence">Deadline & Timeliness</option>
                <option value="Communication">Communication & Responsiveness</option>
              </select>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="text-slate-400 block mb-1">Star Rating</label>
              <div className="flex space-x-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Written Feedback */}
            <div>
              <label className="text-slate-400 block mb-1">Detailed Feedback</label>
              <textarea
                rows={4}
                required
                placeholder="Describe code quality, bug handling, or milestone performance..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Review...' : 'Submit Freelancer Review'}
            </button>
          </form>
        </div>

        {/* Public Reviews List */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4 flex justify-between items-center">
            <span>Verified Freelancer Reviews</span>
            <span className="text-xs text-indigo-400 font-mono font-normal">
              {reviews.length} Submissions
            </span>
          </h2>

          {isLoading ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              Loading feedback feed...
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              No freelancer reviews submitted yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Client: {rev.userName || 'Anonymous Client'}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        Freelancer: {formatAddress(rev.targetAddress)}
                      </span>
                    </div>

                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span className="bg-slate-900 px-2.5 py-0.5 rounded text-indigo-300 border border-slate-800">
                      {rev.category || 'Freelancer Quality'}
                    </span>
                    <span>{new Date(rev.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};