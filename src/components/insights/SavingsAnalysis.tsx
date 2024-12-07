import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format } from 'date-fns';

export function SavingsAnalysis() {
  const { transactions, userProfile } = useFinanceStore();
  
  // Get the last 12 months
  const today = new Date();
  const monthsInterval = {
    start: new Date(today.getFullYear() - 1, today.getMonth(), 1),
    end: endOfMonth(today),
  };
  
  const monthlySavings = eachMonthOfInterval(monthsInterval).map(date => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTransactions = transactions.filter(t => 
      new Date(t.date) >= monthStart &&
      new Date(t.date) <= monthEnd
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      month: format(date, 'MMM yyyy'),
      savings,
      savingsRate,
    };
  });

  const totalSavings = monthlySavings.reduce((sum, month) => sum + month.savings, 0);
  const averageSavings = totalSavings / monthlySavings.length;
  const averageSavingsRate = monthlySavings.reduce((sum, month) => sum + month.savingsRate, 0) / monthlySavings.length;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Savings Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Savings (12 months)</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalSavings, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average Monthly Savings</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(averageSavings, userProfile?.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average Savings Rate</p>
          <p className="text-2xl font-bold text-purple-600">
            {averageSavingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySavings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'savings' 
                  ? formatCurrency(value as number, userProfile?.currency)
                  : `${(value as number).toFixed(1)}%`,
                name === 'savings' ? 'Savings' : 'Savings Rate'
              ]}
            />
            <Bar dataKey="savings" fill="#10B981" name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {userProfile?.savingsGoal && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Savings Goal</span>
            <span>
              {((totalSavings / userProfile.savingsGoal) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ 
                width: `${Math.min((totalSavings / userProfile.savingsGoal) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Current: {formatCurrency(totalSavings, userProfile.currency)}</span>
            <span>Goal: {formatCurrency(userProfile.savingsGoal, userProfile.currency)}</span>
          </div>
        </div>
      )}
    </Card>
  );
}