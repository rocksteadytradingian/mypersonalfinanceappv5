import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format } from 'date-fns';

export function IncomeAnalysis() {
  const { transactions, userProfile } = useFinanceStore();
  
  // Get the last 12 months
  const today = new Date();
  const monthsInterval = {
    start: new Date(today.getFullYear() - 1, today.getMonth(), 1),
    end: endOfMonth(today),
  };
  
  const monthlyData = eachMonthOfInterval(monthsInterval).map(date => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthIncome = transactions
      .filter(t => 
        t.type === 'income' &&
        new Date(t.date) >= monthStart &&
        new Date(t.date) <= monthEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(date, 'MMM yyyy'),
      income: monthIncome,
    };
  });

  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const averageIncome = totalIncome / monthlyData.length;
  const highestIncome = Math.max(...monthlyData.map(m => m.income));
  const lowestIncome = Math.min(...monthlyData.map(m => m.income));

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Income Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Average Monthly Income</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(averageIncome)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Annual Income</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrency(value as number)} 
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              name="Income" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Highest Monthly Income</p>
          <p className="font-medium text-green-600">
            {formatCurrency(highestIncome)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Lowest Monthly Income</p>
          <p className="font-medium text-yellow-600">
            {formatCurrency(lowestIncome)}
          </p>
        </div>
      </div>
    </Card>
  );
}