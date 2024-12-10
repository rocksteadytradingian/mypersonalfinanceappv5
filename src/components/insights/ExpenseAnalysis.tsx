import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];

interface ExpenseCategory {
  name: string;
  value: number;
}

export function ExpenseAnalysis() {
  const { transactions } = useFinanceStore();
  
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const currentMonthExpenses = transactions.filter(t => 
    t.type === 'expense' &&
    new Date(t.date) >= monthStart &&
    new Date(t.date) <= monthEnd
  );

  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, [] as ExpenseCategory[]);

  const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Expense Analysis</h3>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600">Total Monthly Expenses</p>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expensesByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {expensesByCategory.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {expensesByCategory.map((category, index) => (
          <div key={category.name} className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{category.name}</span>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(category.value)}
              </p>
              <p className="text-sm text-gray-500">
                {((category.value / totalExpenses) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}