import { useState, useCallback } from 'react';
import {
  rpc,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  xdr,
  Account,
} from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '../config/stellar';
import { EscrowStatus } from '../types/escrow';
import type { Escrow } from '../types/escrow';

// Helper: Convert XLM (e.g., "100") to Stroops BigInt (e.g., 1000000000n)
const toStroops = (xlmAmount: string | number): bigint => {
  const parsed = typeof xlmAmount === 'string' ? parseFloat(xlmAmount) : xlmAmount;
  if (isNaN(parsed) || parsed <= 0) return 0n;
  return BigInt(Math.round(parsed * 10_000_000));
};

// Helper: Convert Stroops (BigInt/number/string) back to standard XLM string
const fromStroops = (stroops: any): string => {
  if (!stroops) return '0';
  const val = Number(stroops);
  return (val / 10_000_000).toString();
};

export function useEscrow() {
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const server = new rpc.Server(STELLAR_CONFIG.rpcUrl);
  const contract = new Contract(STELLAR_CONFIG.contractId);

  // Helper: Log transaction to Google Apps Script Web App
  const logTransactionToSheet = async (payload: Record<string, any>) => {
    try {
      await fetch(STELLAR_CONFIG.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'log_transaction', ...payload }),
      });
    } catch (err) {
      console.warn('Failed to log transaction to Google Sheet:', err);
    }
  };

  // Read current Escrow state from contract
  const fetchEscrow = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);

      const dummyAccount = new Account(
        'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
        '0'
      );

      const tx = new TransactionBuilder(dummyAccount, {
        fee: '100',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(contract.call('get_escrow'))
        .setTimeout(30)
        .build();

      const simRes = await server.simulateTransaction(tx);

      if (rpc.Api.isSimulationSuccess(simRes) && simRes.result) {
        const rawNative: any = scValToNative(simRes.result.retval);

        // Retrieve local metadata names/emails if saved during creation
        const savedMeta = JSON.parse(
          localStorage.getItem('stellarflow_escrow_meta') || '{}'
        );

        const escrowData: Escrow = {
          client: rawNative.client,
          clientName: savedMeta.clientName || 'Client',
          clientEmail: savedMeta.clientEmail || '',
          freelancer: rawNative.freelancer,
          freelancerName: savedMeta.freelancerName || 'Freelancer',
          freelancerEmail: savedMeta.freelancerEmail || '',
          token: rawNative.token,
          // Format amounts back to human-readable XLM
          totalAmount: fromStroops(rawNative.total_amount),
          releasedAmount: fromStroops(rawNative.released_amount),
          deadline: Number(rawNative.deadline),
          status: rawNative.status as EscrowStatus,
          milestones: rawNative.milestones.map((m: any) => ({
            id: Number(m.id),
            description: m.description,
            amount: fromStroops(m.amount),
            isCompleted: Boolean(m.is_completed),
            isInReview: savedMeta[`review_m_${m.id}`] || false,
          })),
        };
        setEscrow(escrowData);
      } else {
        setEscrow(null);
      }
    } catch (err: any) {
      console.error('Fetch Escrow Error:', err);
      setEscrow(null);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Submit signed transaction helper
  const submitSignedTransaction = async (preparedTx: any): Promise<string> => {
    const signedResult = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    });

    const signedXdr =
      typeof signedResult === 'string'
        ? signedResult
        : (signedResult as any)?.signedTxXdr || signedResult;

    const sendRes = await server.sendTransaction(
      TransactionBuilder.fromXDR(signedXdr, STELLAR_CONFIG.networkPassphrase)
    );

    if (sendRes.status === 'PENDING') {
      setTxHash(sendRes.hash);
      let statusRes = await server.getTransaction(sendRes.hash);
      while (statusRes.status === 'NOT_FOUND') {
        await new Promise((r) => setTimeout(r, 2000));
        statusRes = await server.getTransaction(sendRes.hash);
      }
      await fetchEscrow();
      return sendRes.hash;
    } else {
      throw new Error('Transaction submission failed on Testnet.');
    }
  };

  // Initialize Escrow Contract
  const createEscrow = async (
    userAddress: string,
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
    try {
      setIsSubmitting(true);
      setError(null);
      setTxHash(null);

      const account = await server.getAccount(userAddress);

      // Convert input XLM amounts to Stroops (10^7) before passing to smart contract
      const totalStroops = toStroops(totalAmount);

      const formattedMilestones = milestones.map((m) =>
        xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('amount'),
            val: nativeToScVal(toStroops(m.amount), { type: 'i128' }),
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('description'),
            val: xdr.ScVal.scvString(m.description),
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('id'),
            val: nativeToScVal(m.id, { type: 'u32' }),
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('is_completed'),
            val: xdr.ScVal.scvBool(false),
          }),
        ])
      );

      const tx = new TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'create_escrow',
            new Address(userAddress).toScVal(),
            new Address(freelancer).toScVal(),
            new Address(token).toScVal(),
            nativeToScVal(totalStroops, { type: 'i128' }),
            nativeToScVal(BigInt(deadline), { type: 'u64' }),
            xdr.ScVal.scvVec(formattedMilestones)
          )
        )
        .setTimeout(30)
        .build();

      const preparedTx = await server.prepareTransaction(tx);
      const hash = await submitSignedTransaction(preparedTx);

      // Store metadata in LocalStorage for persistence across updates
      localStorage.setItem(
        'stellarflow_escrow_meta',
        JSON.stringify({
          clientName,
          clientEmail,
          freelancerName,
          freelancerEmail,
        })
      );

      // Log ESCROW_CREATED event to Google Sheet
      await logTransactionToSheet({
        eventType: 'ESCROW_CREATED',
        clientName,
        clientAddress: userAddress,
        clientEmail,
        freelancerName,
        freelancerAddress: freelancer,
        freelancerEmail,
        totalAmount,
        txHash: hash,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create escrow.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Work for Review (Freelancer trigger)
  const submitWorkForReview = async (milestoneId: number) => {
    try {
      if (!escrow) return;
      const milestone = escrow.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return;

      const savedMeta = JSON.parse(
        localStorage.getItem('stellarflow_escrow_meta') || '{}'
      );
      savedMeta[`review_m_${milestoneId}`] = true;
      localStorage.setItem('stellarflow_escrow_meta', JSON.stringify(savedMeta));

      setEscrow((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          milestones: prev.milestones.map((m) =>
            m.id === milestoneId ? { ...m, isInReview: true } : m
          ),
        };
      });

      // Log WORK_SUBMITTED event to Google Sheet
      await logTransactionToSheet({
        eventType: 'WORK_SUBMITTED',
        clientName: escrow.clientName || 'Client',
        clientAddress: escrow.client,
        clientEmail: escrow.clientEmail,
        freelancerName: escrow.freelancerName || 'Freelancer',
        freelancerAddress: escrow.freelancer,
        freelancerEmail: escrow.freelancerEmail,
        totalAmount: escrow.totalAmount,
        milestoneId,
        milestoneDescription: milestone.description,
        milestoneAmount: milestone.amount,
        txHash: '',
      });
    } catch (err: any) {
      console.error('Submit work error:', err);
    }
  };

  // Approve Milestone invocation
  const approveMilestone = async (userAddress: string, milestoneId: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setTxHash(null);

      const account = await server.getAccount(userAddress);
      const milestoneVal = nativeToScVal(milestoneId, { type: 'u32' });

      const tx = new TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(contract.call('approve_milestone', milestoneVal))
        .setTimeout(30)
        .build();

      const preparedTx = await server.prepareTransaction(tx);
      const hash = await submitSignedTransaction(preparedTx);

      const milestone = escrow?.milestones.find((m) => m.id === milestoneId);

      // Reset review flag in localStorage
      const savedMeta = JSON.parse(
        localStorage.getItem('stellarflow_escrow_meta') || '{}'
      );
      delete savedMeta[`review_m_${milestoneId}`];
      localStorage.setItem('stellarflow_escrow_meta', JSON.stringify(savedMeta));

      // Log MILESTONE_RELEASED event to Google Sheet
      await logTransactionToSheet({
        eventType: 'MILESTONE_RELEASED',
        clientName: escrow?.clientName || 'Client',
        clientAddress: userAddress,
        clientEmail: escrow?.clientEmail,
        freelancerName: escrow?.freelancerName || 'Freelancer',
        freelancerAddress: escrow?.freelancer || '',
        freelancerEmail: escrow?.freelancerEmail,
        totalAmount: escrow?.totalAmount || '',
        milestoneId,
        milestoneDescription: milestone?.description || '',
        milestoneAmount: milestone?.amount || '',
        txHash: hash,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to approve milestone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refund Expired Escrow invocation
  const refundExpired = async (userAddress: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setTxHash(null);

      const account = await server.getAccount(userAddress);

      const tx = new TransactionBuilder(account, {
        fee: '10000',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(contract.call('refund_expired'))
        .setTimeout(30)
        .build();

      const preparedTx = await server.prepareTransaction(tx);
      const hash = await submitSignedTransaction(preparedTx);

      // Log REFUNDED event to Google Sheet
      await logTransactionToSheet({
        eventType: 'REFUNDED',
        clientName: escrow?.clientName || 'Client',
        clientAddress: userAddress,
        clientEmail: escrow?.clientEmail,
        freelancerName: escrow?.freelancerName || 'Freelancer',
        freelancerAddress: escrow?.freelancer || '',
        freelancerEmail: escrow?.freelancerEmail,
        totalAmount: escrow?.totalAmount || '',
        txHash: hash,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to execute refund.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}