import { useCallback, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { supabase } from '../config/supabase';
import { Transaction } from '../types/finance';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (apiError) throw apiError;
      
      if (data) {
        useFinanceStore.getState().addTransaction(data);
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create transaction'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Transaction>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (apiError) throw apiError;
      
      if (data) {
        useFinanceStore.getState().updateTransaction(id, data);
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update transaction'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: apiError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (apiError) throw apiError;

      useFinanceStore.getState().deleteTransaction(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete transaction'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}