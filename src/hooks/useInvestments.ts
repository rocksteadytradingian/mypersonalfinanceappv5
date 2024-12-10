import { useCallback, useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as investmentService from '../services/supabase/investments';
import { Investment } from '../types/finance';

export function useInvestments() {
  const { userProfile } = useFinanceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvestments = useCallback(async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const data = await investmentService.getInvestments(userProfile.id);
      useFinanceStore.getState().setInvestments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch investments'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createInvestment = useCallback(async (investment: Omit<Investment, 'id'>) => {
    if (!userProfile) return;

    try {
      const data = await investmentService.createInvestment(userProfile.id, investment);
      useFinanceStore.getState().addInvestment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create investment'));
      throw err;
    }
  }, [userProfile]);

  const updateInvestment = useCallback(async (id: string, investment: Partial<Investment>) => {
    if (!userProfile) return;

    try {
      const data = await investmentService.updateInvestment(userProfile.id, id, investment);
      useFinanceStore.getState().updateInvestment(id, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update investment'));
      throw err;
    }
  }, [userProfile]);

  const deleteInvestment = useCallback(async (id: string) => {
    if (!userProfile) return;

    try {
      await investmentService.deleteInvestment(userProfile.id, id);
      useFinanceStore.getState().deleteInvestment(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete investment'));
      throw err;
    }
  }, [userProfile]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    loading,
    error,
    fetchInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
  };
}