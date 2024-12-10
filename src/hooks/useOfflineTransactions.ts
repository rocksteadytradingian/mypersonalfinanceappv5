import { useCallback } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction } from '../types/finance';

interface PendingTransaction {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: Partial<Transaction>;
  timestamp: number;
}

const STORAGE_KEY = 'pending_transactions';

export function useOfflineTransactions() {
  const getPendingTransactions = useCallback((): PendingTransaction[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const addPendingTransaction = useCallback((transaction: PendingTransaction) => {
    const pending = getPendingTransactions();
    pending.push(transaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  }, [getPendingTransactions]);

  const removePendingTransaction = useCallback((id: string) => {
    const pending = getPendingTransactions();
    const filtered = pending.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }, [getPendingTransactions]);

  const clearPendingTransactions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    getPendingTransactions,
    addPendingTransaction,
    removePendingTransaction,
    clearPendingTransactions,
  };
}