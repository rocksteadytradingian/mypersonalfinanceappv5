import { supabase } from '../../config/supabase';
import { CreditCard } from '../../types/finance';

export async function getCreditCards(userId: string) {
  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createCreditCard(userId: string, creditCard: Omit<CreditCard, 'id'>) {
  const { data, error } = await supabase
    .from('credit_cards')
    .insert([{ ...creditCard, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCreditCard(userId: string, id: string, creditCard: Partial<CreditCard>) {
  const { data, error } = await supabase
    .from('credit_cards')
    .update(creditCard)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCreditCard(userId: string, id: string) {
  const { error } = await supabase
    .from('credit_cards')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}