import { useCallback, useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as loanService from '../services/supabase/loans';
import { Loan } from '../types/finance';

export function useLoans() {
  const { userProfile } = useFinanceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLoans = useCallback(async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const data = await loanService.getLoans(userProfile.id);
      useFinanceStore.getState().setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch loans'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createLoan = useCallback(async (loan: Omit<Loan, 'id'>) => {
    if (!userProfile) return;

    try {
      const data = await loanService.createLoan(userProfile.id, loan);
      useFinanceStore.getState().addLoan(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create loan'));
      throw err;
    }
  }, [userProfile]);

  const updateLoan = useCallback(async (id: string, loan: Partial<Loan>) => {
    if (!userProfile) return;

    try {
      const data = await loanService.updateLoan(userProfile.id, id, loan);
      useFinanceStore.getState().updateLoan(id, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update loan'));
      throw err;
    }
  }, [userProfile]);

  const deleteLoan = useCallback(async (id: string) => {
    if (!userProfile) return;

    try {
      await loanService.deleteLoan(userProfile.id, id);
      useFinanceStore.getState().deleteLoan(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete loan'));
      throw err;
    }
  }, [userProfile]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loading,
    error,
    fetchLoans,
    createLoan,
    updateLoan,
    deleteLoan,
  };
}