import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';

export function SpendingHabits() {
  const { transactions, userProfile } = useFinanceStore();
  
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const expenses = transactions.filter(t => t.type === 'expense');
  const monthlyExpenses = expenses.filter(t => 
    new Date(t.date) >= monthStart && 
    new Date(t.date) <= monthEnd
  );
  const weeklyExpenses = expenses.filter(t => 
    new Date(t.date) >= weekStart && 
    new Date(t.date) <= weekEnd
  );

  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalWeeklyExpenses = weeklyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const averageDailyExpense = totalMonthlyExpenses / new Date(monthEnd).getDate();

  // Find largest single expense
  const largestExpense = expenses.reduce((max, t) => 
    t.amount > max.amount ? t : max
  , expenses[0]);

  // Find most frequent category
  const categoryFrequency = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentCategory = Object.entries(categoryFrequency).reduce((max, [category, count]) =>
    count > max.count ? { category, count } : max
  , { category: '', count: 0 });

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Spending Habits</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Spending</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalMonthlyExpenses, userProfile?.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Weekly Spending</p>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrency(totalWeeklyExpenses, userProfile?.currency)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Average Daily Expense</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(averageDailyExpense, userProfile?.currency)}
          </p>
        </div>

        {largestExpense && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Largest Single Expense</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{largestExpense.category}</p>
              <p className="text-red-600 font-bold">
                {formatCurrency(largestExpense.amount, userProfile?.currency)}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(largestExpense.date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-600 mb-2">Most Frequent Category</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{mostFrequentCategory.category}</p>
            <p className="text-sm text-gray-500">
              {mostFrequentCategory.count} transactions
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}