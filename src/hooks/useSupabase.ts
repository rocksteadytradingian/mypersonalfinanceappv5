import { useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction, Budget, FundSource, CreditCard, Investment, Loan, UserProfile } from '../types/finance';

export function useSupabase() {
  const { userProfile } = useFinanceStore();

  const syncTransactions = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as Transaction[];
  }, [userProfile]);

  const syncBudgets = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as Budget[];
  }, [userProfile]);

  const syncFundSources = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('fund_sources')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as FundSource[];
  }, [userProfile]);

  const syncCreditCards = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as CreditCard[];
  }, [userProfile]);

  const syncInvestments = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as Investment[];
  }, [userProfile]);

  const syncLoans = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', userProfile.id);

    if (error) throw error;
    return data as Loan[];
  }, [userProfile]);

  const syncUserProfile = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userProfile.id)
      .single();

    if (error) throw error;
    return data as UserProfile;
  }, [userProfile]);

  return {
    syncTransactions,
    syncBudgets,
    syncFundSources,
    syncCreditCards,
    syncInvestments,
    syncLoans,
    syncUserProfile,
  };
}