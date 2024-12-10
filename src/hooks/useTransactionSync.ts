import { useEffect, useCallback } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { supabase } from '../config/supabase';
import { Transaction } from '../types/finance';

export function useTransactionSync() {
  const { setTransactions } = useFinanceStore();

  const syncTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error syncing transactions:', error);
    }
  }, [setTransactions]);

  // Initial sync
  useEffect(() => {
    syncTransactions();
  }, [syncTransactions]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            useFinanceStore.getState().addTransaction(payload.new as Transaction);
          } else if (payload.eventType === 'UPDATE') {
            useFinanceStore.getState().updateTransaction(payload.new.id, payload.new as Transaction);
          } else if (payload.eventType === 'DELETE') {
            useFinanceStore.getState().deleteTransaction(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { syncTransactions };
}