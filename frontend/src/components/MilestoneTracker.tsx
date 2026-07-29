import React from 'react';
import type { Milestone } from '../types/escrow';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Coins 
} from 'lucide-react';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isClient: boolean;
  isFreelancer?: boolean;
  isSubmitting: boolean;
  onSubmitWork?: (milestoneId: number) => void;
  onApprove: (milestoneId: number) => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  isClient,
  isFreelancer,
  isSubmitting,
  onSubmitWork,
  onApprove,
}) => {
  return (
    <div className="mt-8 bg-slate-950/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-inner">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
            <span>Milestone Release Schedule</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-custodial milestone approval & payout timeline
          </p>
        </div>
        <span className="text-xs font-mono font-semibold bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
          {milestones.filter((m) => m.isCompleted).length} / {milestones.length} Released
        </span>
      </div>

      <div className="space-y-4">
        {milestones.map((m) => {
          const isCompleted = m.isCompleted;
          const isInReview = m.isInReview && !isCompleted;

          return (
            <div
              key={m.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 gap-4 ${
                isCompleted
                  ? 'bg-emerald-950/10 border-emerald-500/30'
                  : isInReview
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Left Side: Info */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex items-center space-x-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700 font-mono">
                    Milestone #{m.id}
                  </span>
                  <span className="text-base font-bold text-white tracking-tight">
                    {m.description}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Payout Amount:{' '}
                    <strong className="text-slate-200 font-sans">{m.amount} XLM</strong>
                  </span>
                </div>
              </div>

              {/* Right Side: Status Badge & Actions */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0 border-slate-800/60">
                
                {/* 1. Milestone Completed / Released */}
                {isCompleted && (
                  <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Funds Released</span>
                  </div>
                )}

                {/* 2. Work Under Review State */}
                {isInReview && (
                  <div className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-3.5 py-1.5 rounded-xl animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span>Work Under Review</span>
                  </div>
                )}

                {/* 3. Pending State (Not in review, not completed) */}
                {!isCompleted && !isInReview && (
                  <div className="flex items-center space-x-1.5 bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </div>
                )}

                {/* Freelancer Action: Submit Work for Review */}
                {isFreelancer && !isCompleted && !isInReview && onSubmitWork && (
                  <button
                    onClick={() => onSubmitWork(m.id)}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-150 shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                )}

                {/* Client Action: Approve & Release Funds */}
                {isClient && !isCompleted && (
                  <button
                    onClick={() => onApprove(m.id)}
                    disabled={isSubmitting}
                    className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl transition duration-150 shadow-md active:scale-95 ${
                      isInReview
                        ? 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-amber-500/20 animate-bounce'
                        : 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-indigo-600/20'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {isSubmitting ? 'Processing...' : 'Approve & Release'}
                    </span>
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};