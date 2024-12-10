import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];

interface DebtData {
  name: string;
  value: number;
  minimumPayment: number;
  interestRate: number;
}

export function DebtAnalysis() {
  const { debts, transactions } = useFinanceStore();
  
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  const debtPayments = transactions
    .filter(t => t.type === 'debt')
    .reduce((sum, t) => sum + t.amount, 0);

  const debtData = debts.map(debt => ({
    name: debt.name,
    value: debt.amount,
    minimumPayment: debt.minimumPayment,
    interestRate: debt.interestRate,
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Debt Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Debt</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Payments</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalMinPayments)}
          </p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={debtData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {debtData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {debtData.map((debt, index) => (
          <div key={debt.name} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium">{debt.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium">
                  {formatCurrency(debt.value)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Monthly</p>
                <p className="font-medium">
                  {formatCurrency(debt.minimumPayment)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Interest</p>
                <p className="font-medium">{debt.interestRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}