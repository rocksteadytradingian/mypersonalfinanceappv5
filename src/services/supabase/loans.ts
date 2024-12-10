import { supabase } from '../../config/supabase';
import { Loan } from '../../types/finance';

export async function getLoans(userId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createLoan(userId: string, loan: Omit<Loan, 'id'>) {
  const { data, error } = await supabase
    .from('loans')
    .insert([{ ...loan, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLoan(userId: string, id: string, loan: Partial<Loan>) {
  const { data, error } = await supabase
    .from('loans')
    .update(loan)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLoan(userId: string, id: string) {
  const { error } = await supabase
    .from('loans')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}