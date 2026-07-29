import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Code2, 
  Lock, 
  Users, 
  Briefcase, 
  Sparkles,
  ExternalLink,
  Database
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const demoUrl = 'https://drive.google.com/file/d/1OR1QGHJBFW7D19ROtxp_Zyf-B1wCNHhl/view?usp=drive_link';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Radial Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
        
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-mono font-bold tracking-wide shadow-lg shadow-indigo-950/50">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Next-Gen Non-Custodial Soroban Milestone Vaults</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Trustless Work Escrow for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
              Web3 Freelancers & Clients
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            StellarFlow locks payments cryptographically on Stellar Testnet. Milestone-based payouts release automatically upon approval with full audit trails and automated email notifications.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <NavLink
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Launch App Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-800 rounded-2xl text-sm font-bold transition hover:border-slate-700 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Open Project Demo Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Live Platform Stats Banner */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left font-mono">
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-indigo-400">0%</span>
              <span className="text-[11px] text-slate-400 block">Custodial Risk</span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-emerald-400">&lt; 5s</span>
              <span className="text-[11px] text-slate-400 block">Soroban Finality</span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-violet-400">100%</span>
              <span className="text-[11px] text-slate-400 block">On-Chain Audit</span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-amber-400">7-Day</span>
              <span className="text-[11px] text-slate-400 block">Refund Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS STELLARFLOW & CORE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white">Why Choose StellarFlow?</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Eliminating payment delays, fraudulent chargebacks, and central intermediary fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Non-Custodial Escrow Vaults</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Funds are held directly inside Soroban smart contract WASM bytecode on-chain. Neither client, freelancer, nor platform admins can extract funds arbitrarily.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl space-y-4 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Granular Milestone Releases</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Projects split into dynamic milestone stages. As freelancers complete work items, clients review deliverables and release funds incrementally.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl space-y-4 hover:border-violet-500/40 transition group">
            <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Audit Trail & Email Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every on-chain event triggers real-time data persistence via Google Apps Script and dispatches personalized email updates to all contract parties.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHO USES STELLARFLOW? (TARGET AUDIENCE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Built for the Global Web3 Ecosystem</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed to serve freelancers, DAOs, agencies, and individual clients seeking verifiable contract execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
              <Users className="w-6 h-6 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">DAOs & Web3 Teams</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fund grants and bounty tasks with guaranteed refund protection if milestone deadlines expire without deliverable submissions.
              </p>
            </div>

            <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Freelance Developers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work with confidence knowing 100% of the project budget is cryptographically locked before starting line 1 of code.
              </p>
            </div>

            <div className="p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
              <Code2 className="w-6 h-6 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Agencies & Clients</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain complete authority to approve or request revisions on individual milestones prior to token release.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW TO USE STELLARFLOW (STEP-BY-STEP WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">How It Works in 4 Steps</h2>
          <p className="text-xs text-slate-400">
            From wallet connection to milestone completion in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-3 relative">
            <span className="text-xs font-bold text-indigo-400">Step 01</span>
            <h3 className="text-sm font-bold text-white font-sans">Connect Wallet</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Connect Freighter wallet on Stellar Testnet to auto-sync XLM balances.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-3 relative">
            <span className="text-xs font-bold text-amber-400">Step 02</span>
            <h3 className="text-sm font-bold text-white font-sans">Lock Agreement</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Define milestones and lock total budget inside the Soroban WASM contract.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-3 relative">
            <span className="text-xs font-bold text-emerald-400">Step 03</span>
            <h3 className="text-sm font-bold text-white font-sans">Submit & Review</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Freelancer submits work deliverables for client verification.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-3 relative">
            <span className="text-xs font-bold text-violet-400">Step 04</span>
            <h3 className="text-sm font-bold text-white font-sans">Approve Payout</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Client approves milestone to instantly transfer XLM payout to freelancer.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CALL-TO-ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-indigo-900/80 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to Secure Your Web3 Contracts?</h2>
            <p className="text-xs sm:text-sm text-indigo-200">
              Initialize your first milestone escrow agreement on Stellar Testnet right now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <NavLink
              to="/create"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Create New Escrow
            </NavLink>
            <NavLink
              to="/docs"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition"
            >
              Explore Technical Docs
            </NavLink>
          </div>
        </div>
      </section>

    </div>
  );
};