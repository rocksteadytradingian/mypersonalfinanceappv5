import { useCallback, useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as fundSourceService from '../services/supabase/fundSources';
import { FundSource } from '../types/finance';

export function useFundSources() {
  const { userProfile } = useFinanceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFundSources = useCallback(async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const data = await fundSourceService.getFundSources(userProfile.id);
      useFinanceStore.getState().setFundSources(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch fund sources'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createFundSource = useCallback(async (fundSource: Omit<FundSource, 'id'>) => {
    if (!userProfile) return;

    try {
      const data = await fundSourceService.createFundSource(userProfile.id, fundSource);
      useFinanceStore.getState().addFundSource(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create fund source'));
      throw err;
    }
  }, [userProfile]);

  const updateFundSource = useCallback(async (id: string, fundSource: Partial<FundSource>) => {
    if (!userProfile) return;

    try {
      const data = await fundSourceService.updateFundSource(userProfile.id, id, fundSource);
      useFinanceStore.getState().updateFundSource(id, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update fund source'));
      throw err;
    }
  }, [userProfile]);

  const deleteFundSource = useCallback(async (id: string) => {
    if (!userProfile) return;

    try {
      await fundSourceService.deleteFundSource(userProfile.id, id);
      useFinanceStore.getState().deleteFundSource(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete fund source'));
      throw err;
    }
  }, [userProfile]);

  useEffect(() => {
    fetchFundSources();
  }, [fetchFundSources]);

  return {
    loading,
    error,
    fetchFundSources,
    createFundSource,
    updateFundSource,
    deleteFundSource,
  };
}