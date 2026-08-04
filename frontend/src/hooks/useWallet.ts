import { useState, useEffect, useCallback } from 'react';
import {
  isAllowed,
  setAllowed,
  getAddress,
  requestAccess,
  isConnected,
} from '@stellar/freighter-api';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Fetch native XLM balance using Stellar Horizon Testnet REST API
  const fetchBalance = useCallback(async (address: string) => {
    try {
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${address}`
      );
      if (!response.ok) {
        setXlmBalance('0.00');
        return;
      }
      const data = await response.json();
      const nativeBalance = data.balances?.find(
        (b: any) => b.asset_type === 'native'
      );
      if (nativeBalance && nativeBalance.balance) {
        // Truncate to 4 decimal places without rounding up
        const rawStr = nativeBalance.balance.toString();
        const parts = rawStr.split('.');
        if (parts.length > 1) {
          setXlmBalance(`${parts[0]}.${parts[1].substring(0, 4)}`);
        } else {
          setXlmBalance(`${parts[0]}.00`);
        }
      } else {
        setXlmBalance('0.00');
      }
    } catch (err) {
      console.warn('Failed to fetch XLM balance from Horizon REST API:', err);
      setXlmBalance('0.00');
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const connectedRes = await isConnected();
      const connected =
        typeof connectedRes === 'boolean'
          ? connectedRes
          : Boolean((connectedRes as any)?.isConnected);

      if (connected) {
        const allowedRes = await isAllowed();
        const allowed =
          typeof allowedRes === 'boolean'
            ? allowedRes
            : Boolean((allowedRes as any)?.isAllowed);

        if (allowed) {
          const addrRes = await getAddress();
          const address =
            typeof addrRes === 'string'
              ? addrRes
              : (addrRes as any)?.address;

          if (address) {
            setPublicKey(address);
            await fetchBalance(address);
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to check Freighter wallet status.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance]);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Check if extension is installed in the browser
      const connectedRes = await isConnected();
      const connected =
        typeof connectedRes === 'boolean'
          ? connectedRes
          : Boolean((connectedRes as any)?.isConnected);

      if (!connected) {
        throw new Error('Freighter wallet not installed. Please install the Freighter extension.');
      }

      // 2. Request permission and address
      await setAllowed();

      const accessRes = await requestAccess();
      const address =
        typeof accessRes === 'string'
          ? accessRes
          : (accessRes as any)?.address;

      if (address) {
        setPublicKey(address);
        await fetchBalance(address);
      } else {
        const fallbackRes = await getAddress();
        const fallbackAddress =
          typeof fallbackRes === 'string'
            ? fallbackRes
            : (fallbackRes as any)?.address;

        if (fallbackAddress) {
          setPublicKey(fallbackAddress);
          await fetchBalance(fallbackAddress);
        } else {
          throw new Error('Could not retrieve address from Freighter.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'User rejected wallet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setXlmBalance(null);
  };

  const refreshBalance = useCallback(async () => {
    if (publicKey) {
      await fetchBalance(publicKey);
    }
  }, [publicKey, fetchBalance]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    publicKey,
    xlmBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}