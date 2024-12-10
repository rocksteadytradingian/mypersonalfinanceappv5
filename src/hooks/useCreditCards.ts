import { useCallback, useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as creditCardService from '../services/supabase/creditCards';
import { CreditCard } from '../types/finance';

export function useCreditCards() {
  const { userProfile } = useFinanceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreditCards = useCallback(async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const data = await creditCardService.getCreditCards(userProfile.id);
      useFinanceStore.getState().setCreditCards(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch credit cards'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createCreditCard = useCallback(async (creditCard: Omit<CreditCard, 'id'>) => {
    if (!userProfile) return;

    try {
      const data = await creditCardService.createCreditCard(userProfile.id, creditCard);
      useFinanceStore.getState().addCreditCard(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create credit card'));
      throw err;
    }
  }, [userProfile]);

  const updateCreditCard = useCallback(async (id: string, creditCard: Partial<CreditCard>) => {
    if (!userProfile) return;

    try {
      const data = await creditCardService.updateCreditCard(userProfile.id, id, creditCard);
      useFinanceStore.getState().updateCreditCard(id, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update credit card'));
      throw err;
    }
  }, [userProfile]);

  const deleteCreditCard = useCallback(async (id: string) => {
    if (!userProfile) return;

    try {
      await creditCardService.deleteCreditCard(userProfile.id, id);
      useFinanceStore.getState().deleteCreditCard(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete credit card'));
      throw err;
    }
  }, [userProfile]);

  useEffect(() => {
    fetchCreditCards();
  }, [fetchCreditCards]);

  return {
    loading,
    error,
    fetchCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
  };
}