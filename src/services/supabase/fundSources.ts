import { supabase } from '../../config/supabase';
import { FundSource } from '../../types/finance';

export async function getFundSources(userId: string) {
  const { data, error } = await supabase
    .from('fund_sources')
    .select('*')
    .eq('user_id', userId)
    .order('bank_name');

  if (error) throw error;
  return data;
}

export async function createFundSource(userId: string, fundSource: Omit<FundSource, 'id'>) {
  const { data, error } = await supabase
    .from('fund_sources')
    .insert([{ ...fundSource, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFundSource(userId: string, id: string, fundSource: Partial<FundSource>) {
  const { data, error } = await supabase
    .from('fund_sources')
    .update(fundSource)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFundSource(userId: string, id: string) {
  const { error } = await supabase
    .from('fund_sources')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}