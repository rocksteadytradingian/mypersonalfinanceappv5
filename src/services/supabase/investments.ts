import { supabase } from '../../config/supabase';
import { Investment } from '../../types/finance';

export async function getInvestments(userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createInvestment(userId: string, investment: Omit<Investment, 'id'>) {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ ...investment, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvestment(userId: string, id: string, investment: Partial<Investment>) {
  const { data, error } = await supabase
    .from('investments')
    .update(investment)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInvestment(userId: string, id: string) {
  const { error } = await supabase
    .from('investments')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}