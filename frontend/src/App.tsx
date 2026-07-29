import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CreateEscrowModal } from './components/CreateEscrowModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CreateEscrowPage } from './pages/CreateEscrowPage';
import { HistoryPage } from './pages/HistoryPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { DocsPage } from './pages/DocsPage';
import { useWallet } from './hooks/useWallet';
import { useEscrow } from './hooks/useEscrow';
import { STELLAR_CONFIG } from './config/stellar';

import { ExternalLink, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const {
    publicKey,
    xlmBalance,
    isLoading: isWalletLoading,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const {
    escrow,
    isFetching,
    isSubmitting,
    txHash,
    error,
    fetchEscrow,
    createEscrow,
    submitWorkForReview,
    approveMilestone,
    refundExpired,
  } = useEscrow();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Sync contract state on mount
  useEffect(() => {
    fetchEscrow();
  }, [fetchEscrow]);

  // Sync local error state from hook
  useEffect(() => {
    if (error) {
      setBannerError(error);
    }
  }, [error]);

  // Handler for escrow creation
  const handleCreateEscrowSubmit = async (
    clientName: string,
    clientEmail: string,
    freelancer: string,
    freelancerName: string,
    freelancerEmail: string,
    token: string,
    totalAmount: string,
    deadline: number,
    milestones: { id: number; description: string; amount: string }[]
  ) => {
    if (!publicKey) {
      alert('Please connect your Freighter wallet first.');
      return;
    }

    await createEscrow(
      publicKey,
      clientName,
      clientEmail,
      freelancer,
      freelancerName,
      freelancerEmail,
      token,
      totalAmount,
      deadline,
      milestones
    );

    setIsCreateModalOpen(false);
    await refreshBalance();
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans antialiased">
        
        <div>
          {/* Global Multi-Page Navigation Bar */}
          <Navbar
            publicKey={publicKey}
            xlmBalance={xlmBalance}
            isLoading={isWalletLoading}
            escrow={escrow}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />

          {/* Toast / Banner Notification Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
            {bannerError && (
              <div className="bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs sm:text-sm p-4 rounded-2xl mb-4 flex items-center justify-between shadow-lg shadow-rose-950/30">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{bannerError}</span>
                </div>
                <button
                  onClick={() => setBannerError(null)}
                  className="p-1 hover:bg-rose-900/60 rounded-lg text-rose-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {txHash && (
              <div className="bg-indigo-950/80 border border-indigo-800/80 text-indigo-200 text-xs sm:text-sm p-4 rounded-2xl mb-4 flex items-center justify-between shadow-lg shadow-indigo-950/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Transaction confirmed on Testnet!{' '}
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-mono text-indigo-300 hover:text-white inline-flex items-center space-x-1 font-bold ml-1"
                    >
                      <span>View on Stellar Expert</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Router View Outlets */}
          <Routes>
            {/* 1. Landing / Home Page */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Operations Dashboard View */}
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  escrow={escrow}
                  publicKey={publicKey}
                  isFetching={isFetching}
                  isSubmitting={isSubmitting}
                  onFetchEscrow={fetchEscrow}
                  onSubmitWorkForReview={submitWorkForReview}
                  onApproveMilestone={async (id: number) => {
                    if (publicKey) {
                      await approveMilestone(publicKey, id);
                      await refreshBalance();
                    }
                  }}
                  onRefundExpired={async () => {
                    if (publicKey) {
                      await refundExpired(publicKey);
                      await refreshBalance();
                    }
                  }}
                />
              }
            />

            {/* 3. Full-Page Escrow Creation Route */}
            <Route
              path="/create"
              element={
                <CreateEscrowPage
                  isSubmitting={isSubmitting}
                  onSubmit={handleCreateEscrowSubmit}
                />
              }
            />

            {/* 4. Transaction & Audit History Route */}
            <Route
              path="/history"
              element={<HistoryPage publicKey={publicKey} />}
            />

            {/* 5. Community Feedback Route */}
            <Route
              path="/feedback"
              element={<FeedbackPage publicKey={publicKey} escrow={escrow} />}
            />

            {/* 6. System Documentation Route */}
            <Route
              path="/docs"
              element={<DocsPage />}
            />

            {/* Default Route Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Modal Overlays */}
        <CreateEscrowModal
          isOpen={isCreateModalOpen}
          isSubmitting={isSubmitting}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEscrowSubmit}
        />

        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          userAddress={publicKey}
          onClose={() => setIsFeedbackModalOpen(false)}
          onFeedbackSubmitted={fetchEscrow}
        />

        {/* Global Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <span>StellarFlow © 2026 — Soroban Non-Custodial Smart Escrow</span>
            <span className="text-slate-600">
              Contract ID:{' '}
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${STELLAR_CONFIG.contractId}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline"
              >
                {STELLAR_CONFIG.contractId.substring(0, 8)}...
              </a>
            </span>
          </div>
        </footer>

      </div>
    </Router>
  );
}