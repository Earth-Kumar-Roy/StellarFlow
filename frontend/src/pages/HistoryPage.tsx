import React, { useState, useEffect, useCallback } from 'react';
import { rpc } from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../config/stellar';
import { fetchDbTransactions } from '../utils/api';
import type { DbTransaction, TestnetEvent } from '../types/escrow';
import { 
  History, 
  Database, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';

interface HistoryPageProps {
  publicKey: string | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ publicKey }) => {
  const [activeTab, setActiveTab] = useState<'db' | 'testnet'>('db');
  const [dbLogs, setDbLogs] = useState<DbTransaction[]>([]);
  const [testnetEvents, setTestnetEvents] = useState<TestnetEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Fetch Google Sheets Audit Database Logs
  const loadDbHistory = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchDbTransactions(publicKey || undefined);
    setDbLogs(data);
    setIsLoading(false);
  }, [publicKey]);

  // 2. Fetch Raw Events directly from Soroban Testnet RPC Server dynamically
  const loadTestnetEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const server = new rpc.Server(STELLAR_CONFIG.rpcUrl);

      // Dynamically fetch current latest ledger to construct a valid query window
      const latestLedgerHeader = await server.getLatestLedger();
      const currentLedger = latestLedgerHeader.sequence;

      // Query the last 10,000 ledgers to remain well within RPC retention limits
      const startLedger = Math.max(1, currentLedger - 10000);

      const res = await server.getEvents({
        startLedger: startLedger,
        filters: [
          {
            type: 'contract',
            contractIds: [STELLAR_CONFIG.contractId],
          },
        ],
        limit: 20,
      });

      const parsed: TestnetEvent[] = (res.events || []).map((e: any) => ({
        id: e.id,
        ledger: e.ledger,
        createdAt: e.createdAt || new Date().toISOString(),
        topic: e.topic || [],
        txHash: e.txHash || e.txHashStr || '',
      }));

      setTestnetEvents(parsed);
    } catch (err) {
      console.warn('Failed to fetch events from Soroban RPC:', err);
      setTestnetEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'db') {
      loadDbHistory();
    } else {
      loadTestnetEvents();
    }
  }, [activeTab, loadDbHistory, loadTestnetEvents]);

  const formatAddress = (addr: string) =>
    addr ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}` : 'N/A';

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'ESCROW_CREATED':
        return {
          label: 'Escrow Created',
          icon: ShieldCheck,
          color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        };
      case 'WORK_SUBMITTED':
        return {
          label: 'Work Submitted',
          icon: Send,
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'MILESTONE_RELEASED':
        return {
          label: 'Milestone Released',
          icon: CheckCircle2,
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'REFUNDED':
        return {
          label: 'Escrow Refunded',
          icon: RotateCcw,
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          label: type,
          icon: History,
          color: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>Escrow Activity Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Permanent transaction audit trail stored on Google Sheets & Stellar Testnet
          </p>
        </div>

        {/* Tab Selection Controls */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('db')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'db'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('testnet')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'testnet'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Testnet RPC Events</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Fetching activity logs...</p>
        </div>
      ) : activeTab === 'db' ? (
        /* Database Logs Table View */
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Google Sheet Audit Entries {publicKey ? `(Filtered for ${formatAddress(publicKey)})` : '(All Activity)'}
            </span>
            <button
              onClick={loadDbHistory}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl transition"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {dbLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No recorded database logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Event Type</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Freelancer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Explorer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {dbLogs.map((log, index) => {
                    const badge = getEventBadge(log.eventType);
                    const BadgeIcon = badge.icon;
                    return (
                      <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-sans">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badge.color}`}>
                            <BadgeIcon className="w-3.5 h-3.5" />
                            <span>{badge.label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-indigo-400">{log.clientName}</span>
                          <span className="text-[10px] text-slate-500 block">{formatAddress(log.clientAddress)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-emerald-400">{log.freelancerName}</span>
                          <span className="text-[10px] text-slate-500 block">{formatAddress(log.freelancerAddress)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-100">
                          {log.milestoneAmount || log.totalAmount} XLM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.txHash ? (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${log.txHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-indigo-400 hover:underline font-bold"
                            >
                              <span>View Tx</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Testnet RPC Raw Events View */
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Raw Ledger Event Topics (Contract: {formatAddress(STELLAR_CONFIG.contractId)})
            </span>
            <button
              onClick={loadTestnetEvents}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {testnetEvents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No recent Soroban RPC ledger events found for this contract ID.
            </div>
          ) : (
            <div className="space-y-3 font-mono">
              {testnetEvents.map((e) => (
                <div key={e.id} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/50">
                      Ledger #{e.ledger}
                    </span>
                    <p className="text-xs text-slate-300 font-bold mt-1">
                      Event ID: {e.id}
                    </p>
                  </div>
                  {e.txHash && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${e.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:underline font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
                    >
                      <span>Stellar Expert Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};