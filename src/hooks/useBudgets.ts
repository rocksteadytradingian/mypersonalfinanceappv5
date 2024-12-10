import { useCallback, useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as budgetService from '../services/supabase/budgets';
import { Budget } from '../types/finance';

export function useBudgets() {
  const { userProfile } = useFinanceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const data = await budgetService.getBudgets(userProfile.id);
      useFinanceStore.getState().setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch budgets'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createBudget = useCallback(async (budget: Omit<Budget, 'id'>) => {
    if (!userProfile) return;

    try {
      const data = await budgetService.createBudget(userProfile.id, budget);
      useFinanceStore.getState().addBudget(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create budget'));
      throw err;
    }
  }, [userProfile]);

  const updateBudget = useCallback(async (id: string, budget: Partial<Budget>) => {
    if (!userProfile) return;

    try {
      const data = await budgetService.updateBudget(userProfile.id, id, budget);
      useFinanceStore.getState().updateBudget(id, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update budget'));
      throw err;
    }
  }, [userProfile]);

  const deleteBudget = useCallback(async (id: string) => {
    if (!userProfile) return;

    try {
      await budgetService.deleteBudget(userProfile.id, id);
      useFinanceStore.getState().deleteBudget(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete budget'));
      throw err;
    }
  }, [userProfile]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}