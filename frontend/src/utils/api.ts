import { STELLAR_CONFIG } from '../config/stellar';
import type { DbTransaction, UserFeedback } from '../types/escrow';

const SCRIPT_URL = STELLAR_CONFIG.appsScriptUrl;

/**
 * Fetch transaction history from Google Sheets database,
 * optionally filtered by connected user wallet address.
 */
export async function fetchDbTransactions(address?: string): Promise<DbTransaction[]> {
  try {
    const url = new URL(SCRIPT_URL);
    url.searchParams.append('action', 'get_transactions');
    if (address) {
      url.searchParams.append('address', address);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch transactions from Google Sheet endpoint.');
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('fetchDbTransactions error:', err);
    return [];
  }
}

/**
 * Fetch feedback recorded in Google Sheets database,
 * optionally filtered by connected wallet address.
 */
export async function fetchDbFeedback(address?: string): Promise<UserFeedback[]> {
  try {
    const url = new URL(SCRIPT_URL);
    url.searchParams.append('action', 'get_feedback');
    if (address) {
      url.searchParams.append('address', address);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch feedback from Google Sheet endpoint.');
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('fetchDbFeedback error:', err);
    return [];
  }
}

/**
 * Submit user rating, feedback, name, and optional recipient address to Google Sheets database.
 */
export async function submitUserFeedback(payload: {
  userName?: string;
  userAddress: string;
  rating: number;
  comment: string;
  recipientAddress?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'submit_feedback',
        ...payload,
      }),
    });

    if (!res.ok) {
      throw new Error('Feedback submission failed.');
    }

    const result = await res.json();
    return result.status === 'success';
  } catch (err) {
    console.error('submitUserFeedback error:', err);
    return false;
  }
}