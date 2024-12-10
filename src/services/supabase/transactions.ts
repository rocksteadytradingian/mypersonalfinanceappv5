import { supabase } from '../../config/supabase';
import { Transaction } from '../../types/finance';

export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...transaction, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(userId: string, id: string, transaction: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(userId: string, id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}