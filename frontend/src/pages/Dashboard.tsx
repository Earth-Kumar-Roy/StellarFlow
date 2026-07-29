import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { EscrowCard } from '../components/EscrowCard';
import type { Escrow } from '../types/escrow';
import { 
  PlusCircle, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  escrow: Escrow | null;
  publicKey: string | null;
  isFetching: boolean;
  isSubmitting: boolean;
  onFetchEscrow: () => void;
  onSubmitWorkForReview: (id: number) => void;
  onApproveMilestone: (id: number) => void;
  onRefundExpired: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  escrow,
  publicKey,
  isFetching,
  isSubmitting,
  onFetchEscrow,
  onSubmitWorkForReview,
  onApproveMilestone,
  onRefundExpired,
}) => {
  useEffect(() => {
    onFetchEscrow();
  }, [onFetchEscrow]);

  const isClient = publicKey && escrow ? publicKey === escrow.client : false;
  const isFreelancer = publicKey && escrow ? publicKey === escrow.freelancer : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Top Banner & Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Escrow Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Soroban non-custodial milestone vaults & live execution states
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onFetchEscrow}
            disabled={isFetching}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700/80 transition"
            title="Refresh Ledger State"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Syncing...' : 'Sync Contract'}</span>
          </button>

          <NavLink
            to="/feedback"
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700/80 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Give Feedback</span>
          </NavLink>

          <NavLink
            to="/create"
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Agreement</span>
          </NavLink>
        </div>
      </div>

      {/* Role Context Notification Banner */}
      {publicKey && escrow && (
        <div className="p-4 rounded-2xl border backdrop-blur-md transition-all">
          {isClient && (
            <div className="flex items-center space-x-3 text-indigo-300 bg-indigo-950/40 border-indigo-500/30 p-3.5 rounded-xl border">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <strong className="text-indigo-200">Logged in as Client:</strong> You have authority to review submitted milestones and authorize payout releases to the freelancer.
              </div>
            </div>
          )}
          {isFreelancer && (
            <div className="flex items-center space-x-3 text-emerald-300 bg-emerald-950/40 border-emerald-500/30 p-3.5 rounded-xl border">
              <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <strong className="text-emerald-200">Logged in as Freelancer:</strong> Submit work for review on active milestones to alert the client for release.
              </div>
            </div>
          )}
          {!isClient && !isFreelancer && (
            <div className="flex items-center space-x-3 text-slate-300 bg-slate-900/60 border-slate-700/60 p-3.5 rounded-xl border">
              <Eye className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="text-xs">
                <strong className="text-slate-200">Observer Mode:</strong> Your wallet is not a primary participant in this active contract agreement.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-300 font-medium">Querying Soroban Testnet RPC...</p>
        </div>
      ) : escrow ? (
        <EscrowCard
          escrow={escrow}
          userAddress={publicKey}
          isSubmitting={isSubmitting}
          onSubmitWorkForReview={onSubmitWorkForReview}
          onApproveMilestone={onApproveMilestone}
          onRefundExpired={onRefundExpired}
        />
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-5">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Layers className="w-10 h-10" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-xl font-bold text-white">No Active Escrow Detected</h3>
            <p className="text-xs text-slate-400">
              There is currently no active escrow contract deployed at the configured address or your wallet has not initialized one yet.
            </p>
          </div>
          <NavLink
            to="/create"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <span>Initialize First Escrow</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      )}

    </div>
  );
};