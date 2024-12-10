import { supabase } from '../../config/supabase';
import { Budget } from '../../types/finance';

export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('category');

  if (error) throw error;
  return data;
}

export async function createBudget(userId: string, budget: Omit<Budget, 'id'>) {
  const { data, error } = await supabase
    .from('budgets')
    .insert([{ ...budget, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBudget(userId: string, id: string, budget: Partial<Budget>) {
  const { data, error } = await supabase
    .from('budgets')
    .update(budget)
    .eq('user_id', userId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBudget(userId: string, id: string) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
}