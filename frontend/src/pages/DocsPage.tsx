import { STELLAR_CONFIG } from '../config/stellar';
import { 
  ExternalLink, 
  Code2, 
  GitMerge, 
  Zap,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const DocsPage = () => {
  const demoUrl = 'https://sites.google.com/view/ekr1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      
      {/* Hero / Short Description */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Soroban Smart Escrow Architecture v1.0</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            StellarFlow Documentation & System Architecture
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            StellarFlow is a non-custodial, milestone-based escrow platform built on Stellar's Soroban smart contract framework. It ensures cryptographically locked funds, programmatic multi-stage payouts, and real-time transaction audit trails integrated with off-chain logging and notification microservices.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Watch Live Demo Presentation</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${STELLAR_CONFIG.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-sans font-bold text-xs px-5 py-3.5 rounded-xl border border-slate-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify On-Chain Ledger</span>
            </a>
          </div>
        </div>
      </div>

      {/* System Architecture & Operational Diagram */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center justify-center space-x-2 text-center">
          <Layers className="w-6 h-6 text-indigo-400" />
          <span>System Architecture & Operational Diagram</span>
        </h2>

        {/* Centered Architecture Flow Box */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-3xl p-6 sm:p-8 font-mono text-xs shadow-2xl space-y-6 flex flex-col items-center justify-center text-center">
          <div className="border-b border-slate-800 pb-3 text-slate-400 flex flex-col sm:flex-row justify-between items-center w-full gap-2">
            <span className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Core Architectural Flow</span>
            </span>
            <span className="text-[10px] text-indigo-400 font-bold">On-Chain Payout & Reputation Indexing</span>
          </div>

          <div className="w-full overflow-x-auto flex justify-center py-2">
            <pre className="text-indigo-300 leading-relaxed font-mono text-left inline-block">
{`   ┌───────────────────┐    Soroban Contract    ┌────────────────────────┐
   │   Client Wallet   │ ──────(Locks XLM)─────►│  Milestone Vault Core  │
   └─────────┬─────────┘                        └───────────┬────────────┘
             │                                              │
             │ (Approves Deliverables)                      │ (Executes Payout)
             │                                              ▼
             │                                  ┌────────────────────────┐
             └─────────────────────────────────►│   Freelancer Wallet    │
                                                └───────────┬────────────┘
                                                            │
    ┌───────────────────────────────────────────────┐       │
    │           Counterparty Evaluation             │◄──────┘
    ├───────────────────────┬───────────────────────┤
    │  Client Rates On:     │ Freelancer Rates On:  │
    │  • Code & Deliverables│  • Approval Speed     │
    │  • Deadline Adherence │  • Requirement Clarity│
    └───────────┬───────────┴───────────┬───────────┘
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Decentralized Reputation  │
              │  & Audit Indexer Engine   │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Live Community Reputation │
              │     & Feed Dashboard      │
              └───────────────────────────┘`}
            </pre>
          </div>
        </div>

        {/* 3-Column Layer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Layer 1: Web3 Client */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold border-b border-slate-800/80 pb-2">
              <Cpu className="w-4 h-4" />
              <span>1. Web3 Client Layer</span>
            </div>
            <ul className="space-y-2 text-slate-400 leading-relaxed">
              <li>• <strong className="text-slate-200">Freighter Wallet:</strong> Signer & Keypair Manager</li>
              <li>• <strong className="text-slate-200">React + Vite:</strong> Reactive State Engine</li>
              <li>• <strong className="text-slate-200">Stellar SDK:</strong> Transaction Builder & XDR Encoder</li>
            </ul>
          </div>

          {/* Layer 2: On-Chain Soroban */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>2. On-Chain Ledger Layer</span>
            </div>
            <ul className="space-y-2 text-slate-400 leading-relaxed">
              <li>• <strong className="text-slate-200">Soroban Contract:</strong> Milestone Vault Logic</li>
              <li>• <strong className="text-slate-200">XLM SAC Address:</strong> Token Standard Transfers</li>
              <li>• <strong className="text-slate-200">Stellar Testnet:</strong> Consensus & State Persistence</li>
            </ul>
          </div>

          {/* Layer 3: Audit & Notifications */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-violet-400 font-bold border-b border-slate-800/80 pb-2">
              <Database className="w-4 h-4" />
              <span>3. Audit & Indexing Layer</span>
            </div>
            <ul className="space-y-2 text-slate-400 leading-relaxed">
              <li>• <strong className="text-slate-200">Google Apps Script:</strong> REST API Webhook Server</li>
              <li>• <strong className="text-slate-200">Google Sheets:</strong> Permanent Transaction Audit Trail</li>
              <li>• <strong className="text-slate-200">MailApp Service:</strong> Automated Email Notifications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Execution Workflow Pipeline */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <GitMerge className="w-6 h-6 text-violet-400" />
          <span>Execution Workflow Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2 relative">
            <div className="w-8 h-8 bg-indigo-600/20 text-indigo-400 font-mono font-bold rounded-xl flex items-center justify-center border border-indigo-500/30 text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Create & Lock</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Client signs <code className="text-indigo-300">create_escrow</code> via Freighter. Tokens move from Client to Soroban Contract Vault.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2 relative">
            <div className="w-8 h-8 bg-amber-600/20 text-amber-400 font-mono font-bold rounded-xl flex items-center justify-center border border-amber-500/30 text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Work Submission</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Freelancer submits deliverable for a milestone. Work review flag logs to local metadata & Google Sheets.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2 relative">
            <div className="w-8 h-8 bg-emerald-600/20 text-emerald-400 font-mono font-bold rounded-xl flex items-center justify-center border border-emerald-500/30 text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Approve & Release</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Client invokes <code className="text-emerald-300">approve_milestone</code>. Contract executes token transfer to Freelancer.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2 relative">
            <div className="w-8 h-8 bg-rose-600/20 text-rose-400 font-mono font-bold rounded-xl flex items-center justify-center border border-rose-500/30 text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-white">Refund Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              If deadline passes, Client executes <code className="text-rose-300">refund_expired</code> to withdraw remaining unreleased funds.
            </p>
          </div>
        </div>
      </section>

      {/* Project Structure Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-indigo-400" />
          <span>Full Application Project Structure</span>
        </h2>

        <div className="bg-slate-950 border border-slate-800/90 rounded-3xl p-6 font-mono text-xs text-slate-300 overflow-x-auto shadow-2xl">
          <pre className="leading-relaxed">
{`StellarFlow/
├── contracts/
│   └── escrow/
│       ├── Cargo.toml               <-- Rust Dependencies & Soroban SDK configuration
│       └── src/
│           ├── lib.rs               <-- Escrow Contract logic & token transfer invocations
│           ├── types.rs             <-- Data structures (Escrow, Milestone) & custom error enums
│           ├── storage.rs           <-- Soroban Instance Storage keys & persistence helpers
│           └── test.rs              <-- Soroban unit tests
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── config/
│   │   │   └── stellar.ts          <-- RPC, Contract ID & Apps Script endpoints
│   │   ├── types/
│   │   │   └── escrow.ts           <-- TypeScript interfaces for Escrow, Milestones & Audit Logs
│   │   ├── utils/
│   │   │   └── api.ts              <-- API fetchers for Google Apps Script sheet logs
│   │   ├── hooks/
│   │   │   ├── useWallet.ts        <-- Freighter integration & live XLM balance tracker
│   │   │   └── useEscrow.ts        <-- Soroban contract calls & auto-logging triggers
│   │   ├── components/
│   │   │   ├── Navbar.tsx          <-- Multi-page Navigation, XLM Balance & Role Badges
│   │   │   ├── Toast.tsx           <-- On-chain transaction status toasts
│   │   │   ├── MilestoneTracker.tsx<-- Milestone submission & review UI
│   │   │   ├── CountdownTimer.tsx  <-- Expiration deadline counter
│   │   │   ├── EscrowCard.tsx      <-- Primary contract management interface
│   │   │   └── FeedbackModal.tsx   <-- On-chain reputation & sheet logger modal
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       <-- Main Operations Dashboard
│   │   │   ├── CreateEscrowPage.tsx<-- Full-page contract creation form
│   │   │   ├── HistoryPage.tsx     <-- Audit Logs (Testnet RPC Events vs. Google Sheets)
│   │   │   ├── FeedbackPage.tsx    <-- Public Counterparty Reputation Feed
│   │   │   └── DocsPage.tsx        <-- Interactive Technical Documentation (This Page)
│   │   ├── App.tsx                 <-- React Router configuration & global layout
│   │   ├── main.tsx                <-- Entry point
│   │   └── index.css               <-- Tailwind CSS base directives
│   ├── index.html
│   └── package.json
└── README.md`}
          </pre>
        </div>
      </section>

      {/* External Redirection Demo Button Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Need a Complete Demonstration Walkthrough?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Access slide decks, architectural breakdowns, and submission resources on our dedicated site.
          </p>
        </div>
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <span>Open Extended Demo Site</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};